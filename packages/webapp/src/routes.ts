import { html, createStore, updateStore, connect } from '@mantou/gem';
import { GemRouteElement } from '@mantou/gem/elements/route';
import { ValueOf } from 'duoyun-ui/lib/types';

import { paramKeys } from 'src/constants';
import { i18n } from 'src/i18n';

// url data
export const locationStore = GemRouteElement.createLocationStore();

const getInitRoutes = () => {
  return {
    home: {
      title: '',
      pattern: '/',
      redirect: '/games',
    },
    games: {
      title: i18n.get('gamesTitle'),
      pattern: '/games',
      async getContent(_params: Record<string, string>) {
        await import('src/pages/games');
        return html`<p-games></p-games>`;
      },
    },
    rooms: {
      title: i18n.get('roomsTitle'),
      pattern: '/rooms',
      async getContent(_params: Record<string, string>) {
        await import('src/pages/rooms');
        return html`<p-rooms></p-rooms>`;
      },
    },
    room: {
      title: i18n.get('roomTitle'),
      pattern: `/game/:${paramKeys.ROOM_ID}`,
      async getContent(params: Record<string, string>) {
        await import('src/pages/room');
        return html`<p-room id=${params[paramKeys.ROOM_ID]}></p-room>`;
      },
    },
    login: {
      title: i18n.get('loginTitle'),
      pattern: '/login',
      async getContent(_params: Record<string, string>) {
        await import('src/pages/login');
        return html`<p-login></p-login>`;
      },
    },
    register: {
      title: i18n.get('registerTitle'),
      pattern: '/register',
      async getContent(_params: Record<string, string>) {
        await import('src/pages/login');
        return html`<p-login .register=${true}></p-login>`;
      },
    },
    notfound: {
      title: i18n.get('notFoundTitle'),
      pattern: '*',
      async getContent(_params: Record<string, string>) {
        await import('src/pages/notfound');
        return html`<p-notfound></p-notfound>`;
      },
    },
  };
};

type Routes = ReturnType<typeof getInitRoutes>;
export type Route = ValueOf<Routes>;

export const routes = createStore(getInitRoutes() as Routes);

connect(i18n.store, () => {
  Object.entries(getInitRoutes()).forEach(([routeName, route]) => {
    routes[routeName as keyof Routes].title = route.title;
  });
  updateStore(routes);
});
