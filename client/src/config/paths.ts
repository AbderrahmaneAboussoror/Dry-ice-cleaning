const paths = {
  home: {
    path: "/",
    getHref: () => "/",
  },
  profile: {
    path: "/profile",
    getHref: () => "/profile",
  },
  login: {
    path: "/login",
    getHref: () => "/login",
  },
  register: {
    path: "/register",
    getHref: () => "/register",
  },
  admin: {
    dashboard: {
      path: "/admin/dashboard",
      getHref: () => "/admin/dashboard",
    },
    users: {
      path: "/admin/users",
      getHref: () => "/admin/users",
    },
    appointments: {
      path: "/admin/appointments",
      getHref: () => "/admin/appointments",
    },
    packs: {
      path: "/admin/packs",
      getHref: () => "/admin/packs",
    },
  },
};

export default paths;
