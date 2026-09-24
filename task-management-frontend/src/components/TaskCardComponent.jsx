import { useState, useRef, useEffect } from 'react';

const STATUS_CONFIG = {
    PENDING:   { label: 'Pending',   dot: 'bg-amber-400',   text: 'text-amber-700',   badge: 'bg-amber-50 border-amber-200' },
    COMPLETED: { label: 'Completed', dot: 'bg-emerald-400', text: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200' },
};

const TaskCardComponent = ({ task, onDelete, onStatusChange }) => {
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task?.title || '');
    const [editDesc, setEditDesc] = useState(task?.description || '');
    const [error, setError] = useState(null);
    const titleRef = useRef(null);

    useEffect(() => {
        if (editing && titleRef.current) titleRef.current.focus();
    }, [editing]);

    if (!task) return null;

    const config = STATUS_CONFIG[task.status] || {
        label: task.status, dot: 'bg-gray-400', text: 'text-gray-500', badge: 'bg-gray-50 border-gray-200'
    };
    const isPending = task.status === 'PENDING';

    const handleMarkComplete = async () => {
        setUpdating(true);
        setError(null);
        try {
            await onStatusChange(task.id, {
                title: task.title,
                description: task.description || '',
                status: 'COMPLETED',
                categoryId: task.categoryId || null,
            });
        } catch {
            setError('Could not update — try again');
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editTitle.trim()) return;
        setUpdating(true);
        try {
            await onStatusChange(task.id, {
                title: editTitle.trim(),
                description: editDesc.trim(),
                status: task.status,
                categoryId: task.categoryId || null,
            });
            setEditing(false);
        } catch {
            setError('Could not save — try again');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setEditTitle(task.title);
        setEditDesc(task.description || '');
        setEditing(false);
        setError(null);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(task.id);
        } catch {
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    return (
        <div className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group ${deleting ? 'opacity-50 pointer-events-none' : ''}`}>

            {/* Status Badge + Edit Toggle */}
            <div className="flex items-center justify-between mb-2.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${config.badge} ${config.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                </span>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        title="Edit task"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Title + Description — view or edit */}
            {editing ? (
                <div className="space-y-2 mb-3">
                    <input
                        ref={titleRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="w-full text-sm font-semibold text-slate-800 border border-violet-400 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full text-xs text-slate-600 border border-slate-300 rounded-lg px-2.5 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
                        rows={2}
                        placeholder="Add a description..."
                    />
                    <div className="flex gap-1.5">
                        <button
                            onClick={handleSaveEdit}
                            disabled={updating || !editTitle.trim()}
                            className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 font-medium transition-colors"
                        >
                            {updating ? 'Saving…' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{task.title}</p>
                    {task.description && (
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
                    )}
                </>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            {/* Footer Actions */}
            {!editing && (
                <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
                    {/* Left: status action */}
                    <div>
                        {isPending ? (
                            <button
                                onClick={handleMarkComplete}
                                disabled={updating}
                                className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-violet-50 transition-colors disabled:opacity-50"
                            >
                                {updating ? (
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                    </svg>
                                )}
                                {updating ? 'Updating…' : 'Mark complete'}
                            </button>
                        ) : (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                </svg>
                                Done
                            </span>
                        )}
                    </div>

                    {/* Right: delete */}
                    {onDelete && !confirmDelete && (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50"
                        >
                            Delete
                        </button>
                    )}
                    {confirmDelete && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500">Sure?</span>
                            <button
                                onClick={handleDelete}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100"
                            >
                                No
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskCardComponent;
