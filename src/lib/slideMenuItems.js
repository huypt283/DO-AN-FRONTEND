module.exports = [
  {
    type: 'item',
    isHeader: true,
    name: 'MENU QUẢN LÝ'
  },
  {
    type: 'item',
    icon: 'fa fa-area-chart',
    name: 'Biểu đồ thống kê',
    router: {
      name: 'sysadmin/statistics.Index'
    }
  },
  {
    type: 'item',
    icon: 'fa fa-users',
    name: 'Quản lý khách hàng',
    router: {
      name: 'sysadmin/customers.Index'
    }
  },
  {
    type: 'item',
    icon: 'fa fa-book',
    name: 'Quản lý bài đăng',
    router: {
      name: 'sysadmin/articles.Index'
    }
  },
  {
    type: 'item',
    icon: 'fa fa-user-plus',
    name: 'Quản lý nhân viên',
    router: {
      name: 'sysadmin/staffs.Index'
    },
    auth: 'SUPER_ADMIN'
  },
  {
    type: 'item',
    icon: 'fa fa-newspaper-o',
    name: 'Quản lý tin tức',
    router: {
      name: 'sysadmin/news.Index'
    }
  },
  {
    type: 'item',
    icon: 'fa fa-usd',
    name: 'Thống kê giao dịch',
    router: {
      name: 'sysadmin/transactions.Index'
    },
    auth: 'SUPER_ADMIN'
  }
]
