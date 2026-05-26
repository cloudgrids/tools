'use client';

import { CodeOutput, ToolPanel } from '@/components/tools/shared/ToolUi';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { ColorStop } from '@/lib/contracts';
import type { GradientType } from '@/lib/enumerations';
import { buildGradientCss } from '@/lib/gradient';
import { GRADIENT_GALLERY, GRADIENT_PRESETS } from '@/lib/tool-samples';
import { useCallback, useState } from 'react';

export function GradientTool() {
	const [type, setType] = useState<GradientType>('linear');
	const [angle, setAngle] = useState(135);
	const [stops, setStops] = useState<ColorStop[]>(GRADIENT_PRESETS[0].stops.map((stop) => ({ ...stop })));

	const css = buildGradientCss(type, angle, stops);
	const cssProperty = `background-image: ${css};`;

	const updateStop = useCallback((index: number, patch: Partial<ColorStop>) => {
		setStops((previous) => previous.map((stop, current) => (current === index ? { ...stop, ...patch } : stop)));
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 md:grid-cols-2">
				<ToolPanel title="Controls" contentClassName="space-y-6">
					<div className="space-y-2">
						<Label>Type</Label>
						<div className="flex flex-wrap gap-2">
							{(['linear', 'radial', 'conic'] as GradientType[]).map((value) => (
								<Button key={value} variant={type === value ? 'default' : 'outline'} onClick={() => setType(value)}>
									{value.charAt(0).toUpperCase() + value.slice(1)}
								</Button>
							))}
						</div>
					</div>

					{type !== 'radial' && (
						<div className="space-y-3">
							<Label>Angle: {angle} degrees</Label>
							<Slider
								min={0}
								max={360}
								value={[angle]}
								onValueChange={(values) => setAngle(typeof values === 'number' ? values : (values[0] ?? 0))}
							/>
						</div>
					)}

					<div className="space-y-3">
						<Label>Color Stops</Label>
						{stops.map((stop, index) => (
							<div key={`${stop.color}-${index}`} className="flex flex-wrap items-center gap-3">
								<input
									type="color"
									value={stop.color}
									onChange={(event) => updateStop(index, { color: event.target.value })}
									className="h-8 w-10 cursor-pointer rounded border border-input"
								/>
								<Slider
									className="min-w-28 flex-1"
									min={0}
									max={100}
									value={[stop.pos]}
									onValueChange={(values) =>
										updateStop(index, { pos: typeof values === 'number' ? values : (values[0] ?? 0) })
									}
								/>
								<span className="w-10 text-sm text-muted-foreground">{stop.pos}%</span>
								{stops.length > 2 && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setStops((previous) => previous.filter((_, current) => current !== index))}
									>
										Remove
									</Button>
								)}
							</div>
						))}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setStops((previous) => [...previous, { color: '#ffffff', pos: 75 }])}
						>
							Add Stop
						</Button>
					</div>

					<div className="space-y-2">
						<Label>Presets</Label>
						<div className="flex flex-wrap gap-2">
							{GRADIENT_PRESETS.map((preset) => (
								<Button
									key={preset.name}
									variant="outline"
									size="sm"
									onClick={() => setStops(preset.stops.map((stop) => ({ ...stop })))}
								>
									{preset.name}
								</Button>
							))}
						</div>
					</div>
				</ToolPanel>

				<ToolPanel title="Preview" contentClassName="space-y-4">
					<div className="h-48 rounded-lg border border-input" style={{ background: css }} />
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>CSS Output</Label>
							<CopyButton text={cssProperty} label="Copy" />
						</div>
						<CodeOutput className="min-h-16">{cssProperty}</CodeOutput>
					</div>
					<div className="space-y-2">
						<Label>Shorthand</Label>
						<CodeOutput className="min-h-16">{`background: ${css};\nbackground-attachment: fixed;`}</CodeOutput>
					</div>
				</ToolPanel>
			</div>

			<ToolPanel title="Gradient Gallery" contentClassName="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
				{GRADIENT_GALLERY.map((stops, index) => {
					const background = buildGradientCss('linear', 135, stops);
					return (
						<button
							key={background}
							type="button"
							className="h-20 rounded-lg border border-input transition-transform hover:scale-105"
							style={{ background }}
							onClick={() => setStops(stops.map((stop) => ({ ...stop })))}
							aria-label={`Apply gradient ${index + 1}`}
						/>
					);
				})}
			</ToolPanel>
		</div>
	);
}
