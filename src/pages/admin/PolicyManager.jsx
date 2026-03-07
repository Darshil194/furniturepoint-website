import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import './PolicyManager.css'

const PolicyManager = () => {
    const { policies, updatePolicy } = useStore()
    const [selectedType, setSelectedType] = useState('privacy')
    const [content, setContent] = useState('')
    const [isDirty, setIsDirty] = useState(false)
    const [saveStatus, setSaveStatus] = useState(null) // 'saving', 'success', 'error'

    // Load content when selection changes
    useEffect(() => {
        if (policies[selectedType]) {
            setContent(policies[selectedType].content)
            setIsDirty(false)
            setSaveStatus(null)
        }
    }, [selectedType, policies])

    const handleSave = async () => {
        setSaveStatus('saving')
        try {
            await updatePolicy(selectedType, content)
            setIsDirty(false)
            setSaveStatus('success')

            // Clear success message after 3 seconds
            setTimeout(() => setSaveStatus(null), 3000)
        } catch (error) {
            console.error('Failed to save policy:', error)
            setSaveStatus('error')
        }
    }

    const handleChange = (e) => {
        setContent(e.target.value)
        setIsDirty(true)
        setSaveStatus(null)
    }

    return (
        <div className="policy-manager">
            <header className="pm-header">
                <div>
                    <h1 className="pm-title">Policy Management</h1>
                    <p className="pm-subtitle">Manage website policies and legal documents</p>
                </div>
                <div className="pm-actions">
                    {saveStatus === 'success' && (
                        <span className="pm-status success">
                            <CheckCircle size={18} /> Saved
                        </span>
                    )}
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!isDirty || saveStatus === 'saving'}
                    >
                        <Save size={18} />
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            <div className="pm-content">
                <div className="pm-sidebar">
                    <label className="pm-label">Select Policy</label>
                    <div className="pm-nav">
                        {Object.entries(policies).map(([key, policy]) => (
                            <button
                                key={key}
                                className={`pm-nav-item ${selectedType === key ? 'active' : ''}`}
                                onClick={() => {
                                    if (isDirty) {
                                        if (window.confirm('You have unsaved changes. Discard them?')) {
                                            setSelectedType(key)
                                        }
                                    } else {
                                        setSelectedType(key)
                                    }
                                }}
                            >
                                <span className="pm-nav-text">{policy.title}</span>
                                {selectedType === key && isDirty && <span className="dirty-indicator">•</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pm-editor-container">
                    <label className="pm-label">
                        Content (Markdown Supported)
                        <span className="pm-hint">Use ## for headings, - for lists, **text** for bold</span>
                    </label>
                    <textarea
                        className="pm-editor"
                        value={content}
                        onChange={handleChange}
                        spellCheck="false"
                    />
                </div>
            </div>

            <div className="pm-preview-hint">
                <AlertCircle size={16} />
                <span>Changes will be immediately visible on the public website.</span>
            </div>
        </div>
    )
}

export default PolicyManager
