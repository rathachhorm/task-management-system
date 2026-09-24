import { useNavigate } from 'react-router-dom';

const ListBoardComponentHeader = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoToTasks = () => {
        navigate('/tasks');
    };

    return (
        <div>
            <h1>List Board Header</h1>
            <button onClick={handleGoHome}>Go to Home</button>
            <button onClick={handleGoToTasks}>Go to Tasks</button>
        </div>
    );
};

export default ListBoardComponentHeader;
