import { useState, useRef, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';

const EditableSelect = ({
    options,
    value,
    onChange,
    onAdd,
    name, // Extract name prop for proper form handling
    placeholder = "Select option",
    labelKey = "name",
    valueKey = "id",
    disabled = false,
    ...props
}) => {
    const [isWriting, setIsWriting] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (isWriting && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isWriting]);

    const handleSelectChange = (e) => {
        const val = e.target.value;
        if (val === "WRITE_YOUR_OWN_OPTION_MAGIC_STRING") {
            setIsWriting(true);
            setCustomValue("");
        } else {
            // Pass event directly - name is now on the select element
            onChange(e);
        }
    };

    const handleSaveCustom = async () => {
        if (!customValue.trim()) {
            setIsWriting(false);
            return;
        }

        try {
            // Call the onAdd prop which should return the new item node or id
            // It might be an async operation
            const newItem = await onAdd(customValue.trim());

            // If onAdd returns the new item object, we construct a synthetic event
            if (newItem) {
                // Determine the new ID based on structure
                const newId = newItem[valueKey] || newItem.id;
                // We need to pass the name property if it exists on the parent select
                onChange({ target: { value: newId, name: name } }); // Fixed: using destructured 'name'
            }

            setIsWriting(false);
            setCustomValue("");
        } catch (error) {
            console.error("Failed to add custom item:", error);
            // Optionally handle error state here
        }
    };

    const handleCancelCustom = () => {
        setIsWriting(false);
        setCustomValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveCustom();
        } else if (e.key === 'Escape') {
            handleCancelCustom();
        }
    };

    if (isWriting) {
        return (
            <div className="editable-select-input-wrapper" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type new option..."
                    style={{ flex: 1 }}
                    className="editable-input"
                />
                <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="btn-icon-only success"
                    title="Add"
                    style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#4ade80',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Check size={16} />
                </button>
                <button
                    type="button"
                    onClick={handleCancelCustom}
                    className="btn-icon-only cancel"
                    title="Cancel"
                    style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <select
            name={name}
            value={value}
            onChange={handleSelectChange}
            disabled={disabled}
            className="editable-select"
        >
            <option value="">{placeholder}</option>
            {options.map(opt => (
                <option key={opt[valueKey]} value={opt[valueKey]}>
                    {opt[labelKey]}
                </option>
            ))}
            <option value="WRITE_YOUR_OWN_OPTION_MAGIC_STRING" style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'var(--accent)' }}>
                + Write your own...
            </option>
        </select>
    );
};

export default EditableSelect;
