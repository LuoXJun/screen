import * as Cesium from 'cesium';
import { getViewer } from './viewer';

/**
 * 站点实体容器：每站点一个 CustomDataSource，实现站点间实体隔离与 O(1) 显隐切换。
 * 站点相关实体统一经 addSiteEntity 挂入对应容器；与站点无关的全局实体仍走
 * entityPool（entity.ts）。参数 siteKey 为字符串以保持核心层不依赖业务类型。
 *
 * 容器以本模块缓存为同步事实源：Cesium 的 DataSourceCollection.add 内部经
 * Promise.then 延迟入集合，add 后同步查询（length/getByName/contains）均不可见，
 * 不能作为创建/复用判据（同一同步执行流内会重复创建）。缓存未命中时从 viewer
 * 认领同名容器（覆盖模块重载等缓存丢失场景），并顺带清理历史多余容器。
 */
const CONTAINER_PREFIX = 'site-';

/** 站点容器缓存（同步事实源，key 为 siteKey） */
const containerCache = new Map<string, Cesium.CustomDataSource>();

/** 从 viewer 认领已存在的站点容器（同名保留首见，其余清理） */
function claimFromViewer(): void {
    const viewer = getViewer();
    const duplicates: Cesium.DataSource[] = [];
    for (let i = 0; i < viewer.dataSources.length; i++) {
        const dataSource = viewer.dataSources.get(i);
        const name = dataSource.name;
        if (!name?.startsWith(CONTAINER_PREFIX)) continue;
        const key = name.slice(CONTAINER_PREFIX.length);
        if (!containerCache.has(key)) {
            containerCache.set(key, dataSource as Cesium.CustomDataSource);
        } else if (containerCache.get(key) !== dataSource) {
            duplicates.push(dataSource);
        }
    }
    duplicates.forEach((dataSource) => viewer.dataSources.remove(dataSource, true));
}

/** 获取站点容器（懒创建，初始隐藏） */
export function getSiteContainer(siteKey: string): Cesium.CustomDataSource {
    let container = containerCache.get(siteKey);
    if (!container) {
        claimFromViewer();
        container = containerCache.get(siteKey);
    }
    if (!container) {
        container = new Cesium.CustomDataSource(`${CONTAINER_PREFIX}${siteKey}`);
        container.show = false;
        containerCache.set(siteKey, container);
        getViewer().dataSources.add(container);
    }
    return container;
}

/** 获取站点实体集合 */
export function getSiteEntities(siteKey: string): Cesium.EntityCollection {
    return getSiteContainer(siteKey).entities;
}

/** 新增站点实体（同名先删，实体 id 即 name） */
export function addSiteEntity(
    siteKey: string,
    name: string,
    options: Cesium.Entity.ConstructorOptions = {}
): Cesium.Entity {
    const entities = getSiteEntities(siteKey);
    const existing = entities.getById(name);
    if (existing) {
        entities.remove(existing);
    }
    return entities.add({ name, ...options, id: name });
}

/** 移除站点内单个实体（不存在时静默跳过） */
export function removeSiteEntity(siteKey: string, name: string): void {
    const entities = getSiteEntities(siteKey);
    const entity = entities.getById(name);
    if (entity) {
        entities.remove(entity);
    }
}

/** 清空站点实体（保留容器） */
export function clearSiteEntities(siteKey: string): void {
    getSiteContainer(siteKey).entities.removeAll();
    getViewer().scene.requestRender();
}

/** 激活站点：目标容器显示、其余站点容器隐藏（目标未创建时懒创建） */
export function activateSite(siteKey: string): void {
    getSiteContainer(siteKey);
    containerCache.forEach((container, key) => {
        container.show = key === siteKey;
    });
    getViewer().scene.requestRender();
}
