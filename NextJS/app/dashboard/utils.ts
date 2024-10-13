import { type Node } from 'reactflow';

export type TextNode = Node<{ text: string }, 'text'>;
export type ResultNode = Node<Record<string, never>, 'result'>;
export type UppercaseNode = Node<{ text: string }, 'uppercase'>;
export type MyNode = TextNode | ResultNode | UppercaseNode;

export function isTextNode(
  node: MyNode,
): node is TextNode | UppercaseNode {
  return node.type === 'text' || node.type === 'uppercase';
}
