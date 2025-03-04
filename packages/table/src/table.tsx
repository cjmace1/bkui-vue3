/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
*/

import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { debounce, resolveClassName } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import { EMIT_EVENT_TYPES, EMITEVENTS, EVENTS, TABLE_ROW_ATTRIBUTE } from './const';
import userPagination from './plugins/use-pagination';
import useScrollLoading from './plugins/use-scroll-loading';
import { tableProps } from './props';
import TableRender from './render';
import { useClass, useInit } from './use-common';
import {
  observerResize,
  resolveColumnWidth,
} from './utils';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx) {
    const {
      colgroups,
      dragOffsetXStyle,
      reactiveSchema,
      indexData,
      renderFixedColumns,
      setRowExpand,
      initIndexData,
      fixedWrapperClass } = useInit(props);

    let columnSortFn: any = null;
    let columnFilterFn: any = null;

    let observerIns = null;
    const root = ref();
    const refVirtualRender = ref();

    const { pageData, localPagination, resolvePageData, watchEffectFn } = userPagination(props, indexData);
    const {
      tableClass,
      headClass,
      contentClass,
      footerClass,
      wrapperStyle,
      contentStyle,
      headStyle,
      updateBorderClass,
      resetTableHeight,
      hasFooter,
    } = useClass(props, root, reactiveSchema, pageData);

    const tableRender = new TableRender(props, ctx, reactiveSchema, colgroups);

    watch(() => [props.data, props.pagination], () => {
      initIndexData(props.reserveExpand);
      watchEffectFn(columnFilterFn, columnSortFn);
      nextTick(() => {
        resetTableHeight(root.value);
        updateBorderClass(root.value);
      });
    }, { immediate: true, deep: true });

    /**
     * 监听Table 派发的相关事件
     */
    tableRender.on(EVENTS.ON_SORT_BY_CLICK, (args: any) => {
      const { sortFn, column, index, type } = args;
      if (typeof sortFn === 'function') {
        columnSortFn = sortFn;
        pageData.sort(columnSortFn);
      }

      ctx.emit(EMITEVENTS.COLUMN_SORT, { column, index, type });
    }).on(EVENTS.ON_FILTER_CLICK, (args: any) => {
      const { filterFn, checked, column, index } = args;
      if (typeof filterFn === 'function') {
        columnFilterFn = filterFn;
        resolvePageData(columnFilterFn, columnSortFn);
      }

      ctx.emit(EMITEVENTS.COLUMN_FILTER, { checked, column, index });
    })
      .on(EVENTS.ON_SETTING_CHANGE, (args: any) => {
        const { checked = [], size, height } = args;
        checked.length && resolveColumnWidth(root.value, colgroups, 20);
        refVirtualRender.value?.reset?.();
        ctx.emit(EMITEVENTS.SETTING_CHANGE, { checked, size, height });
      })
      .on(EVENTS.ON_ROW_EXPAND_CLICK, (args: any) => {
        const { row, column, index, rows, e } = args;
        ctx.emit(EMITEVENTS.ROW_EXPAND_CLICK, { row, column, index, rows, e });
        setRowExpand(row, !row[TABLE_ROW_ATTRIBUTE.ROW_EXPAND]);
      });


    const handleScrollChanged = (args: any[]) => {
      const preBottom = reactiveSchema.pos.bottom ?? 0;
      const pagination = args[1];
      const { translateX, translateY, pos = {} } = pagination;
      reactiveSchema.scrollTranslateY = translateY;
      reactiveSchema.scrollTranslateX = translateX;
      reactiveSchema.pos = pos;
      const { bottom } = pos;
      if (bottom <= 2 && preBottom > bottom) {
        debounce(60, () => {
          ctx.emit(EMITEVENTS.SCROLL_BOTTOM, { ...pos, translateX, translateY });
        }, true)();
      }
    };

    onMounted(() => {
      observerIns = observerResize(root.value, () => {
        resolveColumnWidth(root.value, colgroups, 20);
        if (props.height === '100%') {
          resetTableHeight(root.value);
        }
      }, 60, true);

      observerIns.start();
    });

    onBeforeUnmount(() => {
      observerIns.stop();
      observerIns = null;
      tableRender.destroy();
    });

    ctx.expose({
      setRowExpand,
    });

    const tableBodyClass = {
      ...contentClass,
      '__is-empty': !pageData.length,
    };

    const tableBodyContentClass = {
      [resolveClassName('table-body-content')]: true,
      'with-virtual-render': props.virtualEnabled,
    };

    const resizeColumnClass = {
      [resolveClassName('drag-column')]: true,
      'offset-x': true,
    };

    const loadingRowClass = {
      'scroll-loading': true,
      _bottom: true,
    };

    const { renderScrollLoading } = useScrollLoading(props, ctx);

    return () => <div class={tableClass.value} style={wrapperStyle.value} ref={root}>
      {
        // @ts-ignore:next-line
        <div class={ headClass } style={headStyle.value}>
        {
          tableRender.renderTableHeadSchema()
        }
      </div>
      }
      <VirtualRender
        ref={refVirtualRender}
        lineHeight={tableRender.getRowHeight}
        class={ tableBodyClass }
        style={ contentStyle }
        list={ pageData }
        contentClassName={ tableBodyContentClass }
        onContentScroll={ handleScrollChanged }
        throttleDelay={0}
        scrollEvent={true}
        enabled={props.virtualEnabled}>
          {
            {
              default: (scope: any) => tableRender.renderTableBodySchema(scope.data || props.data),
            }
          }
      </VirtualRender>
      <div class={ fixedWrapperClass }>
        { renderFixedColumns() }
        <div class={ resizeColumnClass } style={dragOffsetXStyle.value}></div>
        <div class={ loadingRowClass }>{
          renderScrollLoading()
        }</div>
      </div>
      <div class={ footerClass.value }>
        {
          hasFooter.value && tableRender.renderTableFooter(localPagination.value)
        }
      </div>
    </div>;
  },
});

