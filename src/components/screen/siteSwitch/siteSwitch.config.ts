/**
 * 站点按钮装饰配置（设计稿 251-985）。
 * 站点列表与站点维度业务配置见 @/config/site。
 */

/** 按钮装饰层资产名（激活/未激活双套光晕;定位见 siteButton 样式,与设计稿逐层对应） */
export const SITE_BTN_DECOS = {
    active: {
        wide: 'site-btn-glow-wide.svg',
        mid: 'site-btn-glow-mid.svg',
        core: 'site-btn-glow-core.svg',
        spot: 'site-btn-glow-spot.svg',
        top: 'site-btn-glow-top.svg',
        side: 'site-btn-glow-side.svg'
    },
    dim: {
        wide: 'site-btn-glow-wide-dim.svg',
        mid: 'site-btn-glow-mid-dim.svg',
        core: 'site-btn-glow-core-dim.svg',
        side: 'site-btn-glow-side-dim.svg'
    },
    /** 两侧横线（两态共用） */
    lineL: 'site-btn-line-l.svg',
    lineR: 'site-btn-line-r.svg'
} as const;
