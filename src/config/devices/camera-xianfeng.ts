/**
 * 先锋站摄像头分组样本数据（设计稿样本,待接接口）。
 * 坐标围绕站点中心散布（近似值,待实地确认）:全局标牌点位与列表定位共用。
 * 状态铺满枪机 4 态/球机 3 态便于验证。
 */

import { DEVICE_TYPE_DOME as DOME, DEVICE_TYPE_GUN as GUN, type CameraGroup } from './types';

export const XIANFENG_CAMERA_GROUPS: CameraGroup[] = [
    {
        title: '升压站',
        total: 5,
        subgroups: [
            {
                items: [
                    {
                        id: 'CAM-XF-B4-K90',
                        suffix: '备用变',
                        type: GUN,
                        status: 'normal',
                        lng: 105.9216,
                        lat: 26.8622
                    },
                    {
                        id: 'CAM-XF-B4-K91',
                        suffix: 'SVG',
                        type: GUN,
                        status: 'warning',
                        lng: 105.923,
                        lat: 26.8606
                    },
                    {
                        id: 'CAM-XF-B4-K92',
                        suffix: '进出线路',
                        type: GUN,
                        status: 'offline',
                        lng: 105.9212,
                        lat: 26.8588
                    },
                    {
                        id: 'CAM-XF-B4-K93',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.9186,
                        lat: 26.8612
                    },
                    {
                        id: 'CAM-XF-B4-K94',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.9166,
                        lat: 26.8596
                    },
                    {
                        id: 'CAM-XF-B4-K95',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.9182,
                        lat: 26.858
                    },
                    {
                        id: 'CAM-XF-B4-K96',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.9162,
                        lat: 26.8566
                    }
                ]
            }
        ]
    },
    {
        title: '光伏站',
        total: 5,
        subgroups: [
            {
                title: 'A01方阵',
                items: [
                    {
                        id: 'CAM-XF-B4-K10',
                        type: DOME,
                        status: 'normal',
                        lng: 105.9228,
                        lat: 26.858
                    },
                    {
                        id: 'CAM-XF-B4-K11',
                        type: DOME,
                        status: 'fire',
                        lng: 105.9242,
                        lat: 26.857
                    }
                ]
            },
            {
                title: 'A02方阵',
                items: [
                    {
                        id: 'CAM-XF-B4-K12',
                        type: DOME,
                        status: 'normal',
                        lng: 105.9256,
                        lat: 26.8582
                    },
                    {
                        id: 'CAM-XF-B4-K13',
                        type: DOME,
                        status: 'offline',
                        lng: 105.9248,
                        lat: 26.8596
                    }
                ]
            },
            {
                title: 'A03方阵',
                items: [
                    {
                        id: 'CAM-XF-B4-K14',
                        type: DOME,
                        status: 'normal',
                        lng: 105.927,
                        lat: 26.857
                    }
                ]
            },
            {
                title: 'A04方阵',
                items: [
                    {
                        id: 'CAM-XF-B4-K15',
                        type: DOME,
                        status: 'fire',
                        lng: 105.9258,
                        lat: 26.8558
                    },
                    {
                        id: 'CAM-XF-B4-K16',
                        type: DOME,
                        status: 'offline',
                        lng: 105.9272,
                        lat: 26.8556
                    },
                    {
                        id: 'CAM-XF-B4-K17',
                        type: DOME,
                        status: 'normal',
                        lng: 105.9282,
                        lat: 26.859
                    }
                ]
            },
            {
                title: 'A05方阵',
                items: [
                    {
                        id: 'CAM-XF-B4-K18',
                        type: DOME,
                        status: 'normal',
                        lng: 105.9288,
                        lat: 26.8578
                    }
                ]
            }
        ]
    }
];
