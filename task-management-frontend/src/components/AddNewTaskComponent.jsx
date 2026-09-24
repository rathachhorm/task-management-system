import { useState } from 'react';

const AddNewTaskComponent = ({ onTaskAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            await onTaskAdded({
                title: title.trim(),
                description: description.trim(),
                status: 'PENDING',
            });
            setTitle('');
            setDescription('');
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to add task:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTitle('');
        setDescription('');
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                id="add-task-btn"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-200"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-none">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-bold text-slate-800">New task</h2>
                                <p className="text-xs text-slate-400 mt-0.5">What do you need to get done?</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Task title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="task-title-input"
                                    type="text"
                                    placeholder="e.g. Review pull request"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Details <span className="text-slate-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    id="task-desc-input"
                                    placeholder="Any extra context or notes…"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="submit"
                                    id="task-submit-btn"
                                    disabled={loading || !title.trim()}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
                                >
                                    {loading ? 'Adding…' : 'Add task'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddNewTaskComponent;
