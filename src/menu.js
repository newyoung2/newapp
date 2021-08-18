/* 导航栏菜单 */
const menu = [
    {
      title: "Three.js练习",
      icon: "el-icon-menu",
      path: "a",
      children: [
        { title: "添加立方体", icon: "", path: "/three/unit2Example2" },
        { title: "平面光练习", icon: "", path: "/three/unit2Example3" },
        { title: "凸面体练习", icon: "", path: "/three/unit2Example4" },
        {
          title: "几何体转粒子系统",
          icon: "",
          path: "/three/unit2Example5",
        },
        {
          title: "加载OBJ/MTL模型",
          icon: "",
          path: "/three/unit2Example6",
        },
        {
          title: "加载collada模型",
          icon: "",
          path: "/three/unit2Example7",
        },
        { title: "加载ply模型", icon: "", path: "/three/unit2Example8" },
        {
          title: "加载gltf动画模型",
          icon: "",
          path: "/three/unit2Example9",
        },
        { title: "环境贴图", icon: "", path: "/three/unit2Example10" },
        { title: "搭积木", icon: "", path: "/three/unit2Example11" },
        // { title: "天空", icon: "", path: "/three/unit2Example13" }, 
        { title: "风景（天空、大海、球）", icon: "", path: "/three/unit2Example12" },
        { title: "后期渲染bloom", icon: "", path: "/three/unit2Example14" },
      ],
    },
    {
        title:"maptalks练习",
        icon:"el-icon-menu",
        path:"maptalks",
        children:[{
          title:"地图添加3D圆柱体",
          icon:"",
          path:"/maptalks/map1",
        },{
          title:"地图添加房屋",
          icon:"",
          path:"/maptalks/map2",
        },{
          title:"地图添加线条",
          icon:"",
          path:"/maptalks/map3",
        },{
          title:"电磁场",
          icon:"",
          path:"/maptalks/map4",
        },{
          title:"飞线图",
          icon:"",
          path:"/maptalks/map5",
        },{
          title:"飞线图1",
          icon:"",
          path:"/maptalks/map6",
        },{
          title:"拖尾线条",
          icon:"",
          path:"/maptalks/map7",
        }]
    },
    {
      title:"d3练习",
      icon:"el-icon-menu",
      path:"d3",
      children:[{
        title:"水波球",
        icon:"",
        path:"/d3/waterBall",
      },
      {
        title:"打包图",
        icon:"",
        path:"/d3/zoomPack",
      },
      {
        title:"中国地图",
        icon:"",
        path:"/d3/chinaMap",
      },
      {
        title:"中国地图(拖拽、缩放)",
        icon:"",
        path:"/d3/chinaMapDrag",
      },
      {
        title:"力导向图",
        icon:"",
        path:"/d3/force",
      },]
  }
    // {
    //   title: "多级菜单测试",
    //   icon: "el-icon-menu",
    //   path: "b",
    //   children: [
    //     {
    //       title: "二级菜单",
    //       icon: "",
    //       path: "d",
    //       children: [
    //         {
    //           title: "三级菜单",
    //           icon: "",
    //           path: "e",
    //           children: [
    //             {
    //               title: "四级菜单测试",
    //               icon: "",
    //               path: "/ssss",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //     title:"一技菜单",
    //     icon:"el-icon-menu",
    //     path:"c"
    // }
  ]

  export default menu