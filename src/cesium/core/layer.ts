import * as Cesium from 'cesium';
import { getViewer } from './viewer';

/** 业务影像图层注册表：按 name 跟踪管理，便于查找与统一清理 */
const imageryPool = new Map<string, Cesium.ImageryLayer>();

/** 底图图层引用：与业务层隔离，切换底图不会误伤业务层 */
let baseLayer: Cesium.ImageryLayer | null = null;

/** 添加影像图层（name 用于后续查询/删除，同名自动替换旧层） */
export function addImageryLayer(
    provider: Cesium.ImageryProvider,
    name: string,
    options: Cesium.ImageryLayer.ConstructorOptions = {}
): Cesium.ImageryLayer {
    removeImageryLayer(name);
    const layer = new Cesium.ImageryLayer(provider, options);
    getViewer().imageryLayers.add(layer);
    imageryPool.set(name, layer);
    return layer;
}

export function getImageryLayer(name: string): Cesium.ImageryLayer | undefined {
    return imageryPool.get(name);
}

export function hasImageryLayer(name: string): boolean {
    return imageryPool.has(name);
}

/** 移除影像图层（支持按 name 或实例） */
export function removeImageryLayer(nameOrLayer: string | Cesium.ImageryLayer): void {
    const layer = typeof nameOrLayer === 'string' ? imageryPool.get(nameOrLayer) : nameOrLayer;
    if (!layer) return;
    getViewer().imageryLayers.remove(layer, true);
    if (layer === baseLayer) baseLayer = null;
    removeFromPool(imageryPool, nameOrLayer);
}

/** 移除全部影像图层（含底图） */
export function removeAllImageryLayers(): void {
    getViewer().imageryLayers.removeAll(true);
    imageryPool.clear();
    baseLayer = null;
}

/** 切换底图：仅替换底图层并置于最底，保留全部业务影像层 */
export function setBaseImagery(
    provider: Cesium.ImageryProvider,
    name = 'base',
    options: Cesium.ImageryLayer.ConstructorOptions = {}
): Cesium.ImageryLayer {
    if (baseLayer) {
        getViewer().imageryLayers.remove(baseLayer, true);
        removeFromPool(imageryPool, baseLayer);
    }
    const layer = new Cesium.ImageryLayer(provider, options);
    getViewer().imageryLayers.add(layer, 0);
    baseLayer = layer;
    imageryPool.set(name, layer);
    return layer;
}

/** 数据源注册表：按 name 跟踪管理，便于查找与统一清理 */
const dataSourcePool = new Map<string, Cesium.DataSource>();

/** 注册已加载的数据源（自定义 DataSource 也走这里，同名自动替换） */
export function addDataSource(dataSource: Cesium.DataSource, name: string): Cesium.DataSource {
    removeDataSource(name);
    getViewer().dataSources.add(dataSource);
    dataSourcePool.set(name, dataSource);
    return dataSource;
}

export function getDataSource(name: string): Cesium.DataSource | undefined {
    return dataSourcePool.get(name);
}

export function hasDataSource(name: string): boolean {
    return dataSourcePool.has(name);
}

/** 移除数据源（支持按 name 或实例） */
export function removeDataSource(nameOrDataSource: string | Cesium.DataSource): void {
    const dataSource =
        typeof nameOrDataSource === 'string' ? dataSourcePool.get(nameOrDataSource) : nameOrDataSource;
    if (!dataSource) return;
    getViewer().dataSources.remove(dataSource, true);
    removeFromPool(dataSourcePool, nameOrDataSource);
}

export function removeAllDataSources(): void {
    getViewer().dataSources.removeAll(true);
    dataSourcePool.clear();
}

export function loadGeoJson(
    url: string,
    name: string,
    options: Cesium.GeoJsonDataSource.LoadOptions = {}
): Promise<Cesium.GeoJsonDataSource> {
    return trackDataSource(name, Cesium.GeoJsonDataSource.load(url, options));
}

export function loadCzml(
    url: string | object,
    name: string,
    options: Cesium.CzmlDataSource.LoadOptions = {}
): Promise<Cesium.CzmlDataSource> {
    return trackDataSource(name, Cesium.CzmlDataSource.load(url, options));
}

export function loadKml(
    url: string,
    name: string,
    options: Cesium.KmlDataSource.LoadOptions = {}
): Promise<Cesium.KmlDataSource> {
    return trackDataSource(name, Cesium.KmlDataSource.load(url, options));
}

/** 加载完成后自动挂载并注册到数据源池 */
async function trackDataSource<T extends Cesium.DataSource>(name: string, loading: Promise<T>): Promise<T> {
    const dataSource = await loading;
    addDataSource(dataSource, name);
    return dataSource;
}

/** 从注册表删除条目（key 或实例均可） */
function removeFromPool<K, V>(pool: Map<K, V>, keyOrValue: K | V): void {
    if (pool.has(keyOrValue as K)) {
        pool.delete(keyOrValue as K);
        return;
    }
    for (const [key, value] of pool) {
        if (value === keyOrValue) {
            pool.delete(key);
            return;
        }
    }
}
