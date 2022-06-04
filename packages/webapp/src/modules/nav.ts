import {
  GemElement,
  html,
  adoptedStyle,
  customElement,
  createCSSSheet,
  css,
  connectStore,
  boolattribute,
} from '@mantou/gem';
import type { RouteItem } from 'duoyun-ui/elements/route';
import { mediaQuery } from '@mantou/gem/helper/mediaquery';

import { routes } from 'src/routes';
import { i18n } from 'src/i18n';
import { configure, toggoleFriendListState } from 'src/configure';
import { theme } from 'src/theme';
import { favoriteGame, leaveRoom } from 'src/services/api';
import { store } from 'src/store';
import { icons } from 'src/icons';

import 'duoyun-ui/elements/link';
import 'duoyun-ui/elements/use';
import 'duoyun-ui/elements/action-text';
import 'duoyun-ui/elements/modal';
import 'src/modules/game-selector';
import 'src/elements/tooltip';
import 'src/modules/avatar';

type State = {
  select: boolean;
};

const style = createCSSSheet(css`
  :host {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 1;
    background: ${theme.backgroundColor};
  }
  :host([room]) {
    background: linear-gradient(${theme.lightBackgroundColor} -60%, transparent);
  }
  .nav {
    width: min(100%, ${theme.mainWidth});
    box-sizing: border-box;
    padding: 0.5em ${theme.gridGutter};
    margin: auto;
    display: flex;
    align-items: center;
    gap: 1em;
  }
  :host([room]) .nav {
    width: 100%;
  }
  .link {
    border-bottom: 2px solid transparent;
    text-transform: uppercase;
    font-size: 1.25em;
  }
  .link:where(:--active, [data-active]) {
    border-bottom-color: currentColor;
  }
  .title {
    font-size: 1.5em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon {
    width: 3em;
    box-sizing: border-box;
  }
  dy-use.icon {
    padding: 0.3em;
  }
  dy-use.icon:hover {
    background-color: ${theme.hoverBackgroundColor};
  }
  .badge {
    position: absolute;
    right: 0;
    top: 0;
    background: ${theme.negativeColor};
    border-radius: 10em;
    width: 1.5em;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
  }
  @media ${mediaQuery.PHONE} {
    .link {
      display: none;
    }
  }
`);

/**
 * @customElement m-nav
 */
@customElement('m-nav')
@adoptedStyle(style)
@connectStore(configure)
@connectStore(store)
@connectStore(i18n.store)
export class MNavElement extends GemElement<State> {
  @boolattribute room: boolean;

  state: State = {
    select: false,
  };

  render = () => {
    const playing = configure.user?.playing;
    const gameId = playing?.gameId || 0;
    const favorited = store.favoriteIds?.includes(gameId || 0);

    return html`
      <nav class="nav">
        ${this.room
          ? html`
              <nesbox-tooltip .content=${i18n.get('leaveRoom')}>
                <dy-use class="icon" .element=${icons.left} @click=${leaveRoom}></dy-use>
              </nesbox-tooltip>
              ${playing?.host !== configure.user?.id
                ? html`<div class="title">${store.games[gameId || 0]?.name}</div>`
                : html`
                    <nesbox-tooltip .content=${i18n.get('selectGame')}>
                      <dy-action-text class="title" @click=${() => this.setState({ select: true })}>
                        ${store.games[gameId || 0]?.name}
                      </dy-action-text>
                    </nesbox-tooltip>
                  `}
              <dy-use
                class="icon"
                .element=${favorited ? icons.favorited : icons.favorite}
                @click=${() => favoriteGame(gameId, !favorited)}
              ></dy-use>
              <dy-modal
                .open=${this.state.select}
                .disableDefualtOKBtn=${true}
                .header=${i18n.get('selectGame')}
                @close=${() => this.setState({ select: false })}
                .maskCloseable=${true}
              >
                <m-game-selector slot="body"></m-game-selector>
              </dy-modal>
            `
          : html`
              <dy-link style="display: contents" href="/">
                <img class="icon" src="/logo-96.png" />
              </dy-link>
              <dy-active-link class="link" .route=${routes.games as RouteItem}>${routes.games.title}</dy-active-link>
              <dy-active-link class="link" .route=${routes.favorites as RouteItem}>
                ${routes.favorites.title}
              </dy-active-link>
              <dy-active-link class="link" .route=${routes.rooms as RouteItem}>${routes.rooms.title}</dy-active-link>
            `}
        <span style="flex-grow: 1;"></span>
        <dy-use class="icon" .element=${icons.group} @click=${toggoleFriendListState}>
          <!-- <div class="badge">12</div> -->
        </dy-use>
        <m-avatar class="icon"></m-avatar>
      </nav>
    `;
  };
}