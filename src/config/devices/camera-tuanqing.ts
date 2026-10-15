/**
 * 团箐站摄像头分组样本数据（设计稿样本,待接接口）。
 * 坐标围绕站点中心散布（近似值,待实地确认）:全局标牌点位与列表定位共用。
 * 状态铺满枪机 4 态/球机 3 态便于验证。
 */

import { DEVICE_TYPE_DOME as DOME, DEVICE_TYPE_GUN as GUN, type CameraGroup } from './types';

export const TUANQING_CAMERA_GROUPS: CameraGroup[] = [
    {
        title: '升压站',
        total: 5,
        subgroups: [
            {
                items: [
                    {
                        id: 'CAM-TQ-B2-K90',
                        suffix: '备用变',
                        type: GUN,
                        status: 'normal',
                        lng: 105.8534,
                        lat: 26.817
                    },
                    {
                        id: 'CAM-TQ-B2-K91',
                        suffix: 'SVG',
                        type: GUN,
                        status: 'warning',
                        lng: 105.8548,
                        lat: 26.8154
                    },
                    {
                        id: 'CAM-TQ-B2-K92',
                        suffix: '进出线路',
                        type: GUN,
                        status: 'offline',
                        lng: 105.853,
                        lat: 26.8136
                    },
                    {
                        id: 'CAM-TQ-B2-K93',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.8504,
                        lat: 26.816
                    },
                    {
                        id: 'CAM-TQ-B2-K94',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.8484,
                        lat: 26.8144
                    },
                    {
                        id: 'CAM-TQ-B2-K95',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.85,
                        lat: 26.8128
                    },
                    {
                        id: 'CAM-TQ-B2-K96',
                        suffix: '主变电',
                        type: GUN,
                        status: 'overheat',
                        lng: 105.848,
                        lat: 26.8114
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
                        id: 'CAM-TQ-B2-K10',
                        type: DOME,
                        status: 'normal',
                        lng: 105.8546,
                        lat: 26.813
                    },
                    {
                        id: 'CAM-TQ-B2-K11',
                        type: DOME,
                        status: 'fire',
                        lng: 105.856,
                        lat: 26.812
                    }
                ]
            },
            {
                title: 'A02方阵',
                items: [
                    {
                        id: 'CAM-TQ-B2-K12',
                        type: DOME,
                        status: 'normal',
                        lng: 105.8574,
                        lat: 26.8132
                    },
                    {
                        id: 'CAM-TQ-B2-K13',
                        type: DOME,
                        status: 'offline',
                        lng: 105.8566,
                        lat: 26.8146
                    }
                ]
            },
            {
                title: 'A03方阵',
                items: [
                    {
                        id: 'CAM-TQ-B2-K14',
                        type: DOME,
                        status: 'normal',
                        lng: 105.8588,
                        lat: 26.812
                    }
                ]
            },
            {
                title: 'A04方阵',
                items: [
                    {
                        id: 'CAM-TQ-B2-K15',
                        type: DOME,
                        status: 'fire',
                        lng: 105.8576,
                        lat: 26.8108
                    },
                    {
                        id: 'CAM-TQ-B2-K16',
                        type: DOME,
                        status: 'offline',
                        lng: 105.859,
                        lat: 26.8106
                    },
                    {
                        id: 'CAM-TQ-B2-K17',
                        type: DOME,
                        status: 'normal',
                        lng: 105.86,
                        lat: 26.814
                    }
                ]
            },
            {
                title: 'A05方阵',
                items: [
                    {
                        id: 'CAM-TQ-B2-K18',
                        type: DOME,
                        status: 'normal',
                        lng: 105.8606,
                        lat: 26.8128
                    }
                ]
            }
        ]
    }
];
