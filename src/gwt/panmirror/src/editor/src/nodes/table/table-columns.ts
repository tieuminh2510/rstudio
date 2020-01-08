import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { findChildrenByType } from 'prosemirror-utils';

import { PandocTokenType } from '../../api/pandoc';

import { CssAlignment } from './table-commands';

export function tableColumnAlignments(node: ProsemirrorNode) {
  // get the first row (schema requires at least 1 row)
  const firstRow = node.firstChild!;

  // determine # of columns
  const cols = firstRow.childCount;

  // return alignments
  const alignments = new Array<PandocTokenType>(cols);
  for (let i = 0; i < cols; i++) {
    const cell = firstRow.child(i);
    const align: CssAlignment = cell.attrs.align;
    switch (align) {
      case CssAlignment.Left:
        alignments[i] = PandocTokenType.AlignLeft;
        break;
      case CssAlignment.Right:
        alignments[i] = PandocTokenType.AlignRight;
        break;
      case CssAlignment.Center:
        alignments[i] = PandocTokenType.AlignCenter;
        break;
      case null:
      default:
        alignments[i] = PandocTokenType.AlignDefault;
        break;
    }
  }
  return alignments;
}

export function tableColumnWidths(node: ProsemirrorNode) {
  // get the first row (schema requires at least 1 row)
  const firstRow = node.firstChild!;

  // determine # of columns
  const cols = firstRow.childCount;

  // width percentages
  let widths = new Array<number>(cols).fill(0);

  // take note of explicitly sized columns
  const totalWidth = node.attrs.width;
  let availableWidth = totalWidth;
  let colsWithWidth = 0;
  for (let i = 0; i < cols; i++) {
    const col = firstRow.child(i);
    if (col.attrs.colwidth && col.attrs.colwidth[0]) {
      widths[i] = col.attrs.colwidth[0];
      colsWithWidth++;
      availableWidth -= widths[i];
    }
  }

  // allocate remaining widths if we have at least 1 sized columns (otherwise
  // we leave all of the widths at 0 which results in no sizing)
  if (colsWithWidth > 0) {
    if (availableWidth > 0) {
      const defaultWidth = availableWidth / (cols - colsWithWidth);
      for (let i = 0; i < cols; i++) {
        const col = firstRow.child(i);
        if (!col.attrs.colwidth || !col.attrs.colwidth[0]) {
          widths[i] = defaultWidth;
        }
      }
    }

    // convert widths to percentages
    widths = widths.map(width => width / totalWidth);
  }

  return widths;
}

export function fixupTableWidths(view: EditorView) {
  return (tr: Transaction) => {
    const schema = tr.doc.type.schema;

    const tables = findChildrenByType(tr.doc, schema.nodes.table);
    for (const table of tables) {
      // get table width
      const el = view.domAtPos(table.pos).node as HTMLElement;
      const containerWidth = table.node.attrs.width || el.clientWidth;

      // resolve colpercents (read by tokenzier)
      const colpercents = table.node.attrs.colpercents;
      if (colpercents) {
        // for each row
        table.node.forEach((rowNode, rowOffset, r) => {
          // for each cell
          rowNode.forEach((cellNode, cellOffset, c) => {
            const cellPos = table.pos + 1 + rowOffset + 1 + cellOffset;
            const colWidth = [colpercents[c] * containerWidth];
            tr.setNodeMarkup(cellPos, cellNode.type, {
              ...cellNode.attrs,
              colwidth: colWidth,
            });
          });
        });
      }

      if (containerWidth !== table.node.attrs.width || colpercents) {
        tr.setNodeMarkup(table.pos, schema.nodes.table, {
          ...table.node.attrs,
          width: containerWidth,
          colpercents: null,
        });
      }
    }
    return tr;
  };
}
