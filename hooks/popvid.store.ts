import { GenerateInput, GenerateOutput, GenerateResult, GenerationHistory, MemeStatus, UploadResult } from '@/lib/contracts';
import { Updater } from '@/lib/helpers';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type PopVidStore = {
	uploadResult: UploadResult | null;
	generateResult: GenerateOutput | null;
	videoStatus: GenerateResult | null;
	generateInput: GenerateInput;
	history: GenerationHistory[];
	customMemes: MemeStatus[];
	setCustomMemes: (result: Updater<MemeStatus[]>) => void;
	setHistory: (result: Updater<GenerationHistory[]>) => void;
	setGenerateResult: (result: Updater<GenerateOutput | null>) => void;
	setGenerateInput: (result: Updater<GenerateInput>) => void;
	setUploadResult: (result: Updater<UploadResult | null>) => void;
	setVideoStatus: (result: Updater<GenerateResult | null>) => void;
};

export const usePopVidStore = create<PopVidStore>()(
	persist(
		(set) => ({
			uploadResult: null,
			generateResult: null,
			videoStatus: null,
			generateInput: {
				imageBucket: '',
				imagePath: '',
				videoPrompt: '',
				token: ''
			},
			history: [],
			customMemes: [],
			setCustomMemes: (result) =>
				set((state) => ({ customMemes: typeof result === 'function' ? result(state.customMemes) : result })),
			setHistory: (result) => set((state) => ({ history: typeof result === 'function' ? result(state.history) : result })),
			setGenerateInput: (result) =>
				set((state) => ({ generateInput: typeof result === 'function' ? result(state.generateInput) : result })),
			setGenerateResult: (result) =>
				set((state) => ({ generateResult: typeof result === 'function' ? result(state.generateResult) : result })),
			setUploadResult: (result) =>
				set((state) => ({ uploadResult: typeof result === 'function' ? result(state.uploadResult) : result })),
			setVideoStatus: (result) => set((state) => ({ videoStatus: typeof result === 'function' ? result(state.videoStatus) : result }))
		}),
		{ name: 'popvid-store', storage: createJSONStorage(() => localStorage) }
	)
);
