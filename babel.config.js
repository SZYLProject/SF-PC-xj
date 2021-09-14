const plugins = [];

if(process.env.NODE_ENV === 'production') {
  //删除console
  // plugins.push("transform-remove-console")
  //删除log，保留error和warn
  plugins.push(["transform-remove-console", { "exclude": [ "error", "warn"] }])
}
module.exports = {
  plugins: plugins,
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
