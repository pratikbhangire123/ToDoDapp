import '../style.css';
import { useState, useRef, useEffect } from "react";
import Web3Modal from "web3modal";
import { providers, Contract } from 'ethers';
import { TODOLIST_CONTRACT_ADDRESS, abi } from './constants';

export default function ToDoList() {

    const [walletConnected, setWalletConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const Web3ModalRef = useRef();

    const [taskAdded, setTaskAdded] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [taskList, setTaskList] = useState([]);
    const [isChecked, setIsChecked] = useState(false);


    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await Web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        const {chainId} = await web3Provider.getNetwork();
        if (chainId !== 4) {
            window.alert("Change your network to Rinkeby!");
            throw new Error("Change your network to Rinkeby!");
        }

        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };
    
    const handleChange = (e) => {
        setUserInput(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createTask(userInput);
        setUserInput("");
    };

    const createTask = async () => {
        try {

            const signer = await getProviderOrSigner(true);

            const toDoListContract = new Contract(TODOLIST_CONTRACT_ADDRESS, abi, signer);

            if (userInput) {
                const _createTask = await toDoListContract.createTask(userInput);
                setLoading(true);
                await _createTask.wait();
                window.location.reload();
                setLoading(false);
            }
            else {
                alert("Please enter your task!");
            }
        }

        catch (err) {
            console.error(err);
        }
        
    };

    const toggleCompleted = async (e) => {
        try {

           setIsChecked(!isChecked);

           const signer = await getProviderOrSigner(true); 

           const toDoListContract = new Contract(TODOLIST_CONTRACT_ADDRESS, abi, signer);

           const _taskId = e.target.id;

           const _toggleCompleted = await toDoListContract.toggleCompleted(_taskId);

           setLoading(true);
            
           await _toggleCompleted.wait();

           window.location.reload();
                
           setLoading(false);

        }

        catch (err) {
            console.error(err);
        }
    };

    const deleteTasks = async () => {
        try {
            
            const signer = await getProviderOrSigner(true);

            const toDoListContract = new Contract(TODOLIST_CONTRACT_ADDRESS, abi, signer);

            const _deleteTasks = await toDoListContract.deleteTasks();

            setLoading(true);

            await _deleteTasks.wait();

            window.location.reload();

            setLoading(false);

        }

        catch (err) {
            console.error(err);
        }
    };

    const getTasks = async () => {
        try {

            const provider = await getProviderOrSigner();

            const toDoListContract = new Contract(TODOLIST_CONTRACT_ADDRESS, abi, provider);

            const _tasks = await toDoListContract.getTasks();

            setTaskList(_tasks);

            const _numberOfTasks = await toDoListContract.numberOfTasks();

            if (_numberOfTasks > 0) {
                setTaskAdded(true);
            }

            else {
                setTaskAdded(false);
            }

        }

        catch (err) {
            console.error(err);
        }
    };

    const connectWallet = async () => {
        try {

            await getProviderOrSigner();
            setWalletConnected(true);
            getTasks();

        }

        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!walletConnected) {
            Web3ModalRef.current = new Web3Modal({
                network: "rinkeby",
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
        }
    }, [walletConnected]);

    return(
        <main>
        <div className="buttonContainer">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Enter your task...' value={userInput} onChange={handleChange}/>
            <button>Add Task</button>
          </form>
          {taskAdded && <button onClick={deleteTasks}>Delete All Tasks</button>}
        </div>
        <div className={"taskContainer"}>
            {taskAdded === false && <p>Hey, let's create your todo list, add tasks now!</p>}
            {taskList.map(task =>
                <div className={task.completed ? "taskTemplateCompleted" : "taskTemplate"} 
                    key={task.id}>
                    {task.content}
                    <input id={task.id} type="checkbox" onChange={toggleCompleted} checked={task.completed} />
                </div>
            )}
        </div>
      </main> 
    );
}