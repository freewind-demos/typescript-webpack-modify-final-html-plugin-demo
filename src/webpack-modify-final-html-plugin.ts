import {Compiler, compilation} from 'webpack';
import * as webpack from "webpack";

const ThisPluginName = 'WebpackModifyFinalHtmlPlugin';

type AssetSources = { [assetName: string]: string };
type ModifyFn = (html: string, assetSources: AssetSources) => string

type Options = {
  enable: boolean,
  modify: ModifyFn
}

function getAssetSources(compilation: webpack.compilation.Compilation): AssetSources {
  const assetSources: AssetSources = {};
  for (const assetName in compilation.assets) {
    if (compilation.assets.hasOwnProperty(assetName)) {
      assetSources[assetName] = compilation.assets[assetName].source()
    }
  }
  return assetSources;
}

export default class WebpackModifyFinalHtmlPlugin {
  private readonly enable: boolean;
  private readonly modify: ModifyFn;

  constructor(options: Options) {
    this.enable = options.enable;
    this.modify = options.modify;
  }

  apply(compiler: Compiler) {
    if (!this.enable) {
      return;
    }
    compiler.hooks.compilation.tap(ThisPluginName, (compilation: compilation.Compilation) => {
      (compilation.hooks as any)['htmlWebpackPluginAfterHtmlProcessing'].tap(ThisPluginName, (pluginArgs: any) => {
        const assetSources = getAssetSources(compilation);
        pluginArgs.html = this.modify(pluginArgs.html, assetSources);
      });
    });
  }

}
