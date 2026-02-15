import ThreeBackground from './ThreeBackground';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const ChatInterface: React.FC = () => {
    return (
        <div>
            <h1>Chat Interface</h1>
            <ThreeBackground />
        </div>
    )
}

export default ChatInterface