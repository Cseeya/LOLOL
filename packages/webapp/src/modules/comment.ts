import {
  GemElement,
  html,
  adoptedStyle,
  customElement,
  createCSSSheet,
  css,
  property,
  connectStore,
} from '@mantou/gem';
import { Time } from 'duoyun-ui/lib/time';

import { Comment } from 'src/store';
import { theme } from 'src/theme';
import { configure } from 'src/configure';
import { i18n } from 'src/i18n/basic';

import 'duoyun-ui/elements/help-text';

const style = createCSSSheet(css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    width: 100%;
    box-sizing: border-box;
    padding: 1em;
    border-radius: ${theme.normalRound};
    background-color: ${theme.hoverBackgroundColor};
  }
  .header {
    display: flex;
    align-content: center;
    gap: 2px;
  }
  .icon {
    width: 1em;
  }
  .body {
    white-space: pre-wrap;
    margin-block: 0.2em;
    font-size: 0.875em;
    line-height: 1.5;
  }
  .none {
    opacity: 0.5;
    font-style: italic;
  }
`);

/**
 * @customElement m-comment
 */
@customElement('m-comment')
@adoptedStyle(style)
@connectStore(i18n.store)
export class MCommentElement extends GemElement {
  @property comment: Comment;

  get #isSelf() {
    return this.comment.user.id === configure?.user?.id;
  }

  render = () => {
    return html`
      <style>
        :host {
          background-image: ${!this.comment.like
            ? `linear-gradient(to left bottom, ${theme.negativeColor} -300%, transparent)`
            : 'none'};
        }
      </style>
      <dy-help-text class="header">
        [${new Time().relativeTimeFormat(this.comment.updatedAt)}]
        ${i18n.get(
          this.comment.like ? 'page.game.likeGame' : 'page.game.dislikeGame',
          this.#isSelf ? i18n.get('page.game.selfComment') : this.comment.user.nickname,
        )}
        <span style="flex-grow: 1"></span>
      </dy-help-text>
      ${this.comment.body
        ? html`<div class="body">${this.comment.body}</div>`
        : html`<div class="body none">${i18n.get('page.game.emptyComment')}</div>`}
    `;
  };
}
