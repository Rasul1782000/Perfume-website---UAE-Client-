import React from 'react';
import { Smartphone, Tablet, Monitor, ZoomIn, ZoomOut, RotateCw, ShieldCheck } from 'lucide-react';

export type DeviceModel = 'iphone' | 'pixel' | 'ipad' | 'desktop';
export type DeviceFinish = 'titanium' | 'obsidian' | 'sand';

interface ReferoFrameProps {
  device: DeviceModel;
  onDeviceChange: (d: DeviceModel) => void;
  finish: DeviceFinish;
  onFinishChange: (f: DeviceFinish) => void;
  showFrame: boolean;
  onToggleFrame: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  children: React.ReactNode;
}

export const ReferoFrame: React.FC<ReferoFrameProps> = ({
  device,
  onDeviceChange,
  finish,
  onFinishChange,
  showFrame,
  onToggleFrame,
  zoom,
  onZoomChange,
  children,
}) => {
  // Finish styles
  const getChassisStyle = () => {
    switch (finish) {
      case 'titanium':
        return 'border-[#3a3d45] bg-[#1a1c22] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12)]';
      case 'obsidian':
        return 'border-[#22242a] bg-[#0d0f14] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)]';
      case 'sand':
        return 'border-[#443e38] bg-[#221f1c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.14)]';
      default:
        return 'border-[#3a3d45] bg-[#1a1c22]';
    }
  };

  const getDimensions = () => {
    switch (device) {
      case 'iphone':
        return { width: 390, height: 844, radius: 'rounded-[50px]', innerRadius: 'rounded-[44px]' };
      case 'pixel':
        return { width: 412, height: 892, radius: 'rounded-[46px]', innerRadius: 'rounded-[40px]' };
      case 'ipad':
        return { width: 768, height: 1024, radius: 'rounded-[36px]', innerRadius: 'rounded-[30px]' };
      case 'desktop':
        return { width: '100%', height: '100%', radius: 'rounded-xl', innerRadius: 'rounded-lg' };
    }
  };

  const dims = getDimensions();

  if (device === 'desktop' || !showFrame) {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="flex-1 w-full max-w-5xl mx-auto overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center py-6 px-4 transition-all duration-300"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
    >
      {/* Outer Device Chassis */}
      <div
        className={`relative ${dims.radius} border-[11px] ${getChassisStyle()} p-[3px] select-none transition-all duration-300`}
        style={{ width: `${dims.width}px`, height: `${dims.height}px` }}
      >
        {/* Hardware Buttons - Left: Volume Up/Down & Action Button */}
        {device === 'iphone' && (
          <>
            <div className="absolute -left-[14px] top-[108px] w-[3px] h-[28px] bg-[#4a4e58] rounded-l-sm" />
            <div className="absolute -left-[14px] top-[152px] w-[3px] h-[50px] bg-[#4a4e58] rounded-l-sm" />
            <div className="absolute -left-[14px] top-[214px] w-[3px] h-[50px] bg-[#4a4e58] rounded-l-sm" />
            {/* Right: Power / Side Button */}
            <div className="absolute -right-[14px] top-[168px] w-[3px] h-[72px] bg-[#4a4e58] rounded-r-sm" />
          </>
        )}

        {/* Inner Screen Bezel */}
        <div
          className={`relative w-full h-full ${dims.innerRadius} overflow-hidden bg-[#fffbfc] flex flex-col border border-pink-100 shadow-inner`}
        >
          {/* Dynamic Island / Top Hardware Bar */}
          <div className="absolute top-0 left-0 right-0 z-40 h-11 px-7 flex items-center justify-between text-slate-900 text-[12px] font-semibold tracking-tight pointer-events-none select-none">
            {/* Clock */}
            <span>9:41</span>

            {/* Dynamic Island Capsule */}
            {device === 'iphone' && (
              <div className="w-[116px] h-[30px] bg-black text-white rounded-full flex items-center justify-between px-2.5 mx-auto -mt-1 shadow-sm border border-neutral-800">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-950" />
                </div>
                <div className="flex items-center gap-1.5 opacity-80">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 font-mono tracking-tighter">E2EE</span>
                </div>
              </div>
            )}

            {/* System Status Indicators */}
            <div className="flex items-center gap-1.5 opacity-90 text-slate-800">
              {/* Cellular Signal */}
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-[2.5px] h-1.5 bg-slate-800 rounded-xs" />
                <div className="w-[2.5px] h-2 bg-slate-800 rounded-xs" />
                <div className="w-[2.5px] h-2.5 bg-slate-800 rounded-xs" />
                <div className="w-[2.5px] h-3 bg-slate-800 rounded-xs" />
              </div>
              {/* 5G Label */}
              <span className="text-[10px] font-bold">5G</span>
              {/* Battery Indicator */}
              <div className="w-5 h-2.5 border border-slate-700 rounded-[3px] p-[1px] flex items-center">
                <div className="w-3.5 h-full bg-emerald-500 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Device Screen Application Viewport */}
          <div className="flex-1 w-full h-full overflow-hidden flex flex-col pt-10 pb-5">
            {children}
          </div>

          {/* Bottom Home Indicator Pill */}
          <div className="absolute bottom-1 left-0 right-0 h-4 flex items-center justify-center pointer-events-none z-40">
            <div className="w-32 h-1 bg-slate-400/50 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
