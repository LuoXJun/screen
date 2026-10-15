/**
 * 光纤测温/无人机机巢样本点位（设计稿值,待接接口;摄像头点位见 camera.ts）。
 * 坐标为站点附近近似值（待实地确认）;data 为各类型弹窗所需数据。
 */

import type { SiteKey } from '@/config/site';
import type { DevicePoint } from './types';

export const SAMPLE_POINTS_BY_SITE: Record<SiteKey, DevicePoint[]> = {
    xianfeng: [
        {
            id: 'fiber-1',
            type: 'fiber',
            text: '光纤测温·箱变#12高压侧',
            lng: 105.9235,
            lat: 26.8622,
            data: {
                no: 'F3Cc79de-2fec54',
                model: 'Fd491',
                location: '先锋站B区4号方阵·逆变器·组串12',
                installDate: '2026-09-22',
                historyMin: '·在线',
                status: 'online',
                temperature: 62.1,
                tempStatus: 'warning',
                thresholdText: '温度阈值：正常 <70°C · 预警 ≥70°C · 超温 ≥85°C（可配置）',
                trendDates: ['11-12', '11-12', '11-12', '11-12', '11-12', '11-12'],
                trendValues: [500, 470, 620, 440, 1000, 520]
            }
        },
        {
            id: 'nest-1',
            type: 'nest',
            text: '无人机机巢·JC-03',
            lng: 105.9168,
            lat: 26.8574,
            data: {
                no: 'F3Cc79de-2fec54',
                location: '先锋站B区4号方阵·逆变器·组串12',
                installDate: '2026-09-22',
                status: 'online',
                door: '已关闭',
                doorAlert: true,
                charge: '充电中 78%',
                env: '32°C / 54%',
                weather: '风速 3.2m/s',
                weatherTag: '适飞',
                network: 'online',
                drone: '在位 · 电量 62%',
                taskNo: 'UAT-0715-02',
                taskStatus: '执行中',
                taskProgress: 78
            }
        }
    ],
    tuanqing: [
        {
            id: 'fiber-1',
            type: 'fiber',
            text: '光纤测温·箱变#07高压侧',
            lng: 105.8552,
            lat: 26.817,
            data: {
                no: 'F3Cc79de-2fec55',
                model: 'Fd491',
                location: '团箐站A区2号方阵·逆变器·组串8',
                installDate: '2026-09-25',
                historyMin: '·在线',
                status: 'online',
                temperature: 48.6,
                tempStatus: 'normal',
                thresholdText: '温度阈值：正常 <70°C · 预警 ≥70°C · 超温 ≥85°C（可配置）',
                trendDates: ['11-12', '11-12', '11-12', '11-12', '11-12', '11-12'],
                trendValues: [420, 510, 480, 530, 460, 490]
            }
        },
        {
            id: 'nest-1',
            type: 'nest',
            text: '无人机机巢·JC-01',
            lng: 105.8498,
            lat: 26.8129,
            data: {
                no: 'F3Cc79de-2fec55',
                location: '团箐站A区2号方阵·逆变器·组串8',
                installDate: '2026-09-25',
                status: 'online',
                door: '已关闭',
                doorAlert: false,
                charge: '待机',
                env: '28°C / 61%',
                weather: '风速 2.1m/s',
                weatherTag: '适飞',
                network: 'online',
                drone: '在位 · 电量 87%',
                taskNo: 'UAT-0715-05',
                taskStatus: '待命',
                taskProgress: 0
            }
        }
    ]
};
