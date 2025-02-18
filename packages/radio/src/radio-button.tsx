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
import { defineComponent } from 'vue';

import {
  classes,
  PropTypes,
} from '@bkui-vue/shared';

import {
  useFocus,
  useRadio,
} from './common';

const radioButtonProps = {
  name: PropTypes.string.def(''),
  label: PropTypes.oneOfType([String, Number, Boolean]).isRequired,
  modelValue: PropTypes.oneOfType([String, Number, Boolean]).def(''),
  checked: PropTypes.bool.def(false),
  disabled: PropTypes.bool.def(false),
  size: PropTypes.size,
};

export type RadioButtonProps = Readonly<ExtractPropTypes<typeof radioButtonProps>>;

export default defineComponent({
  name: 'RadioButton',
  props: radioButtonProps,
  emits: [
    'change',
    'update:modelValue',
  ],
  setup() {
    const [
      isFocused,
      {
        blur: handleBlur,
        focus: handleFocus,
      },
    ] = useFocus();

    const  {
      isChecked,
      isDisabled,
      setChecked,
      handleChange,
    } = useRadio();

    return {
      isFocused,
      isChecked,
      isDisabled,
      setChecked,
      handleBlur,
      handleFocus,
      handleChange,
    };
  },
  render() {
    const radioClass = classes({
      'bk-radio-button': true,
      'is-focused': this.isFocused,
      'is-disabled': this.isDisabled,
      'is-checked': this.isChecked,
    });

    return (
      <label
        class={radioClass}
        tabindex="0">
        <input
          class="bk-radio-button-input"
          type="radio"
          tabindex="0"
          value={this.label as any}
          checked={this.isChecked}
          disabled={this.isDisabled}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange} />
        <div class="bk-radio-button-text">
          {this.$slots.default ? this.$slots.default() : this.label}
        </div>
      </label>
    );
  },
});
