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

import type { ExtractPropTypes } from 'vue';
import {
  defineComponent,
} from 'vue';

import {
  classes,
  PropTypes,
} from '@bkui-vue/shared';

import {
  useCheckbox,
  useFocus,
} from './common';

export const checkboxProps = {
  modelValue: PropTypes.oneOfType([String, Number, Boolean]).def(''),
  label: PropTypes.oneOfType([String, Number, Boolean]),
  trueLabel: PropTypes.oneOfType([String, Number, Boolean]).def(true),
  falseLabel: PropTypes.oneOfType([String, Number, Boolean]).def(''),
  disabled: PropTypes.bool.def(false),
  checked: PropTypes.bool.def(false),
  indeterminate: PropTypes.bool,
  beforeChange: PropTypes.func,
  size: PropTypes.size(),
};

export type CheckboxProps = Readonly<ExtractPropTypes<typeof checkboxProps>>;

export default defineComponent({
  name: 'Checkbox',
  props: checkboxProps,
  emits: [
    'update:modelValue',
    'change',
  ],
  setup() {
    const [
      isFocus,
      {
        blur: handleBlur,
        focus: handleFocus,
      },
    ] = useFocus();

    const {
      isChecked,
      isDisabled,
      setChecked,
      handleChange,
    } = useCheckbox();

    return {
      isFocus,
      isChecked,
      isDisabled,
      setChecked,
      handleBlur,
      handleFocus,
      handleChange,

    };
  },
  render() {
    const checkboxClass = classes({
      'bk-checkbox': true,
      'is-focused': this.isFocus,
      'is-checked': this.isChecked,
      'is-disabled': this.isDisabled,
      'is-indeterminated': this.indeterminate,
    });
    return (
      <label class={checkboxClass}>
        <span class="bk-checkbox-input">
          <input
            role="checkbox"
            type="checkbox"
            class="bk-checkbox-original"
            disabled={this.isDisabled}
            checked={this.isChecked}
            onChange={this.handleChange} />
        </span>
        {this.$slots.default
          ? this.$slots.default()
          : <span class="bk-checkbox-label">{ this.label }</span>
         }
      </label>
    );
  },
});
