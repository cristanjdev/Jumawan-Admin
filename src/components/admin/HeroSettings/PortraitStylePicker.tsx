import { Check, Loader2 } from 'lucide-react';
import { PORTRAIT_STYLES, type PortraitStyle } from '@/lib/portrait-styles';

interface PortraitStylePickerProps {
    value: PortraitStyle;
    onChange: (style: PortraitStyle) => void;
    /** The style being saved right now, if any */
    saving: PortraitStyle | null;
}

/** Six selectable tiles, one per portrait style; picking one saves it right away */
export function PortraitStylePicker({ value, onChange, saving }: PortraitStylePickerProps) {
    return (
        <div role="radiogroup" aria-label="Portrait style" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PORTRAIT_STYLES.map((style, index) => {
                const selected = style.id === value;
                return (
                    <button
                        key={style.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={saving !== null}
                        onClick={() => !selected && onChange(style.id)}
                        className={`relative rounded-lg border p-4 text-left transition-colors disabled:cursor-wait ${
                            selected
                                ? 'border-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-400/50'
                                : 'border-navy-700 bg-navy-900/40 hover:border-navy-600'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-gray-500">{index + 1}</span>
                            {saving === style.id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                            ) : (
                                selected && <Check className="h-4 w-4 text-cyan-400" />
                            )}
                        </div>
                        <div className="mt-1 font-semibold text-white">{style.name}</div>
                        <p className="mt-1 text-sm text-gray-400">{style.description}</p>
                    </button>
                );
            })}
        </div>
    );
}
