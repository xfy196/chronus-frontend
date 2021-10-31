// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
const taroUIStylePath = "taro-ui/dist/style/components/";
const taroUINamePath = "taro-ui/lib/components/";
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "taro-ui",
        style: (name) => {
          let componentName = name.startsWith("at-")
          ? name.replace(/^at-/, "")
          : name;
          
          if (componentName.startsWith(taroUINamePath)) {
            componentName = componentName.replace(taroUINamePath, "");
          }
          return componentName === "tabs-pane"
            ? false
            : `${taroUIStylePath}${componentName}.scss`;
        },
        customName: (name) => {
          const componentName = name.startsWith("at-")
            ? name.replace(/^at-/, "")
            : name;
          return `${taroUINamePath}${componentName}`;
        },
      },
    ],
  ],
}
