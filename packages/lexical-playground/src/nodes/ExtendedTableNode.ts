/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {SerializedTableNode, TableNode} from '@lexical/table';
import {$applyNodeReplacement} from 'lexical';

export class ExtendedTableNode extends TableNode {
  static getType(): string {
    return 'my-table';
  }

  static clone(node: TableNode): TableNode {
    return new ExtendedTableNode(node.__key);
  }

  static importJSON(serializedNode: SerializedTableNode): TableNode {
    const tableNode = $createTableNode();
    tableNode.__rowStriping = serializedNode.rowStriping || false;
    tableNode.__colWidths = serializedNode.colWidths;
    return tableNode;
  }
}

export function $createTableNode(): TableNode {
  return $applyNodeReplacement(new ExtendedTableNode());
}
