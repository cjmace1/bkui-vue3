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

import { IConfig, IData, INode } from './interface';
class Node implements INode {
  data: IData;
  config: IConfig;
  parent: INode;
  level: number;
  id: string;
  name: string;
  loading: boolean;
  checked: boolean;
  children?: null[];
  hasChildren: boolean;
  pathNodes: INode[];
  path: string[];
  pathNames: string[];
  nodes: INode[];

  constructor(node: IData, config: any, parent?: any) {
    this.data = node;
    this.config = config;
    this.parent = parent || null;
    this.level = !this.parent ? 1 : this.parent.level + 1;

    this.initState();
  }

  initState() {
    const { idKey, nameKey, childrenKey } = this.config;
    this.id = this.data[idKey];
    this.name = this.data[nameKey];

    this.loading = false;
    this.checked = false;

    const childrenData = this.data[childrenKey];
    this.children = (childrenData || []).map(child => new Node(child, this.config, this));
    this.hasChildren = this.children?.length !== 0;

    this.pathNodes = this.calculateNodesPath();
    this.path = this.pathNodes.map(node => node.id);
    this.pathNames = this.pathNodes.map(node => node.name);
  }

  get isLeaf() {
    return !this.hasChildren;
  }

  get isDisabled() {
    return this.data.disabled;
  }

  setNodeCheck(status: boolean) {
    this.checked = status;
  }

  calculateNodesPath() {
    const nodes: INode[] = [this];
    let { parent } = this;
    while (parent) {
      nodes.unshift(parent);
      parent = parent.parent;
    }

    return nodes;
  }
}

export default Node;
