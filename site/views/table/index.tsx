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

import { defineComponent } from 'vue';

import { tableProps } from '../../../packages/table/src/props';
import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { resolvePropsToDesData } from '../utils/index';

import basic from './basic.vue';
import bordered from './bordered.vue';
import cellRender from './cell-render';
import DataEmpty from './data-empty.vue';
import event from './event.vue';
import Expand from './expand.vue';
import fixed from './fixed.vue';
import * as TABLE_DATA from './options';
import pagination from './pagination.vue';
import RemotePagination from './remotePagination.vue';
import ScrollLoading from './scroll-loading.vue';
import ScrollLoadingSlot from './scroll-loading-slot.vue';
import virtualRender from './virtual-render.vue';

export default defineComponent({
  components: {
    basic,
    bordered,
    virtualRender,
    cellRender,
    event,
    pagination,
    RemotePagination,
    DataEmpty,
    fixed,
    ScrollLoading,
    ScrollLoadingSlot,
    Expand,
  },
  render() {
    const menuPropsJson = resolvePropsToDesData(tableProps);

    const configs = [{
      attrs: {
        title: '基础用法',
        subtitle: '基础用法，用于表单内容的录入',
        desc: 'props: --',
        componentName: 'table',
        demoName: 'basic',
      },
      component: () => <basic></basic>,
    },
    {
      attrs: {
        title: '设置边框',
        subtitle: '设置边框显示样式',
        desc: 'props: border',
        componentName: 'table',
        demoName: 'bordered',
      },
      component: () => <bordered></bordered>,
    },
    {
      attrs: {
        title: '启用虚拟滚动-渲染大数据表格',
        subtitle: '大数据模式启用虚拟滚动',
        desc: 'props: virtual-enabled',
        componentName: 'table',
        demoName: 'virtual-render',
      },
      component: () => <virtual-render></virtual-render>,
    },
    {
      attrs: {
        title: '自定义Column渲染',
        subtitle: '自定义Column渲染',
        desc: 'props: column.render',
        componentName: 'table',
        demoName: 'cell-render',
        suffix: '.tsx',
      },
      component: () => <cell-render></cell-render>,
    },
    {
      attrs: {
        title: 'Events',
        subtitle: '自定义Column渲染',
        desc: 'props: column.render',
        componentName: 'table',
        demoName: 'event',
      },
      component: () => <event></event>,
    },
    {
      attrs: {
        title: 'Pagination - Local',
        subtitle: '分页配置',
        desc: 'props: pagination',
        componentName: 'table',
        demoName: 'pagination',
      },
      component: () => <pagination></pagination>,
    },
    {
      attrs: {
        title: 'Pagination - Remote',
        subtitle: '分页配置: remote-pagination = true',
        desc: 'props: pagination',
        componentName: 'table',
        demoName: 'remotePagination',
      },
      component: () => <RemotePagination></RemotePagination>,
    },
    {
      attrs: {
        title: 'Empty - 空数据提示',
        subtitle: '',
        desc: 'props: --',
        componentName: 'table',
        demoName: 'data-empty',
      },
      component: () => <data-empty></data-empty>,
    },
    {
      attrs: {
        title: '固定列',
        subtitle: '横纵内容过多时，可选择固定列',
        desc: 'props: column - fixed',
        componentName: 'table',
        demoName: 'fixed',
      },
      component: () => <fixed></fixed>,
    },
    {
      attrs: {
        title: '底部加载',
        subtitle: '配置底部加载更多',
        desc: '配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载',
        componentName: 'table',
        demoName: 'scroll-loading',
      },
      component: () => <ScrollLoading></ScrollLoading>,
    },
    {
      attrs: {
        title: '底部加载插槽',
        subtitle: '自定义配置底部加载更多,需要设置 scroll-loading = true',
        desc: '配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载',
        componentName: 'table',
        demoName: 'scroll-loading-slot',
      },
      component: () => <ScrollLoadingSlot></ScrollLoadingSlot>,
    },
    {
      attrs: {
        title: '折叠功能',
        subtitle: '结合slot expandRow',
        desc: '',
        componentName: 'table',
        demoName: 'expand',
      },
      component: () => <Expand></Expand>,
    }];

    return (
      <div>
        <DemoTitle
          name="Table"
          desc="Table组件， 为页面和功能提供列表。"
          link="https://www.google.com.hk/"/>
          {
            configs.map(cfg => <DemoBox { ...cfg.attrs } optionData={ TABLE_DATA }>
                 {
                   cfg.component()
                 }
              </DemoBox>)
          }
        <PropsBox propsData={menuPropsJson}/>
      </div>
    );
  },
});
