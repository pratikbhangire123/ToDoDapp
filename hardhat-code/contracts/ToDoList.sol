// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract ToDoList {

    uint public numberOfTasks = 0;

    struct Tasks {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Tasks) public tasks;

    function createTask(string memory _content) public {
        numberOfTasks++;
        tasks[numberOfTasks] = Tasks(numberOfTasks, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Tasks memory _tasks = tasks[_id];
        _tasks.completed = !_tasks.completed;
        tasks[_id] = _tasks;
    }

    function deleteTasks() public {
        uint _id;
        Tasks memory _tasks = tasks[_id];
        delete _tasks;
        numberOfTasks = 0;
    }

    function getTasks() public view returns (Tasks[] memory) {
        Tasks[] memory id = new Tasks[](numberOfTasks);

        for (uint i = 0; i < numberOfTasks; i++) {
            Tasks storage task = tasks[i + 1];
            id[i] = task;
        }
        return id;
    }

}