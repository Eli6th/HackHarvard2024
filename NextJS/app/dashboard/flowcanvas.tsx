"use client";

/* eslint-disable */

import { Button } from '@/components/ui/button';
import React, {useCallback, useRef, useState, useEffect} from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import L1Node from './L1node';
import L0node from './L0node';
import L2Node from './L2node';
import Papa, { ParseResult } from 'papaparse';  // Import the type definitions from PapaParse
import { set } from 'zod';
import {type ApiResponseItem, createSession, pollApiUntilNItems, type SessionResponse, fetchQuestionNode, fetchExaNodes, fetchQuestionNodePrompted} from "@/lib/api";

const nodeTypes = {
  L0: L0node,
  L1: L1Node,
  L2: L2Node,
};

const loadingText = [
  "Step 1/9: Uploading file",
  "Step 2/9: Validating file format",
  "Step 3/9: Loading data into memory",
  "Step 4/9: Cleaning and preprocessing data",
  "Step 5/9: Analyzing descriptive statistics",
  "Step 6/9: Performing feature extraction",
  "Step 7/9: Calculating correlations",
  "Step 8/9: Creating visualizations",
  "Step 9/9: Finalizing and summarizing insights",
  "Step 9/9: Almost there please be patient"
];

const testData = [
  {
    "id": "dde3f55d-b244-4449-8b0c-8557a07c3216",
    "prompt": "Create a contingency table for the relationship between Location and Rain Tomorrow status.Be precise with your results. Any plots should be made with matplotlib and seaborn and should have clearly defined axes and should not be convoluted by using heat maps and alpha values for appropriate graph types. Plots should use histograms for continuous values, and bar graphs for discrete plots. Aggregation of values should also be used for very volatile data values over time.Create a contingency table for the relationship between Location and Rain Tomorrow status.",
    "text": "The contingency table for the relationship between \"Location\" and \"Rain Tomorrow\" is as follows:\n\n| Location         | No Rain (0) | Rain (1) |\n|------------------|-------------|----------|\n| Austin           | 2871        | 784      |\n| Charlotte        | 2845        | 810      |\n| Chicago          | 2818        | 837      |\n| Columbus         | 2832        | 823      |\n| Dallas           | 2866        | 789      |\n| Denver           | 2859        | 796      |\n| Fort Worth       | 2882        | 773      |\n| Houston          | 2880        | 775      |\n| Indianapolis     | 2849        | 806      |\n| Jacksonville     | 2828        | 827      |\n| Los Angeles      | 2851        | 804      |\n| New York         | 2893        | 762      |\n| Philadelphia     | 2832        | 823      |\n| Phoenix          | 2835        | 820      |\n| San Antonio      | 2892        | 763      |\n| San Diego        | 2791        | 864      |\n| San Francisco    | 2827        | 828      |\n| San Jose         | 2835        | 820      |\n| Seattle          | 2840        | 815      |\n| Washington D.C.  | 2862        | 793      |\n\nThis table shows the count of days with and without rain for each location.",
    "title": "Most cities have more dry days than rainy ones.",
    "thread_id": "thread_pF8fO6D26ZUIaI0NHHO3Yz6J",
    "parent_node_id": null,
    "images": [],
    "questions": [
      {
        "id": "30628724-d059-4778-ae59-98c99e64e483",
        "content": "Why do some cities have fewer rainy days?"
      },
      {
        "id": "70313bf7-25c3-4764-b045-379a32388f0a",
        "content": "What factors influence rain distribution among cities?"
      },
      {
        "id": "dda96526-f001-4a53-8696-aa93863eced7",
        "content": "Could local geography affect rain frequency?"
      }
    ]
  },
  {
    "id": "9cf3df01-2ca2-44fc-b7fe-faa2f4d4d2b2",
    "prompt": "Perform a correlation analysis across all numerical variables to identify strongly related features.Be precise with your results. Any plots should be made with matplotlib and seaborn and should have clearly defined axes and should not be convoluted by using heat maps and alpha values for appropriate graph types. Plots should use histograms for continuous values, and bar graphs for discrete plots. Aggregation of values should also be used for very volatile data values over time.Perform a correlation analysis across all numerical variables to identify strongly related features.",
    "text": "There are no strong correlations (absolute correlation coefficient > 0.75) among the numerical variables in this dataset. Therefore, there are no strongly related features according to the provided threshold.",
    "title": "No strong correlations found between variables.",
    "thread_id": "thread_fZ33ywMwseSZfQTp1MEH4XCg",
    "parent_node_id": null,
    "images": [
      {
        "id": "82435f0f-0255-4c5d-99f5-04fd1af41d67",
        "url": "http://localhost:8001/images/82435f0f-0255-4c5d-99f5-04fd1af41d67"
      }
    ],
    "questions": [
      {
        "id": "e8c041c5-17ef-4b7e-9088-4bf31ebaa021",
        "content": "What is a strong correlation threshold and why 0.75?"
      },
      {
        "id": "1099545a-8b3a-4fd9-8280-0c9189164312",
        "content": "What could weak correlations indicate in this data?"
      },
      {
        "id": "c6cf4731-1d9a-4c3f-8ead-0ba3100f507f",
        "content": "Are there any non-linear relationships missed?"
      }
    ]
  },
  {
    "id": "c5c1a905-b522-4cbd-9d1d-a1e7a77cefd0",
    "prompt": "Combine Temperature and Humidity to create a new feature \"Heat Index\" and analyze its distribution.Be precise with your results. Any plots should be made with matplotlib and seaborn and should have clearly defined axes and should not be convoluted by using heat maps and alpha values for appropriate graph types. Plots should use histograms for continuous values, and bar graphs for discrete plots. Aggregation of values should also be used for very volatile data values over time.Combine Temperature and Humidity to create a new feature \"Heat Index\" and analyze its distribution.",
    "text": "The Heat Index distribution is right-skewed, with the majority of values clustering around 60 to 100. Beyond this range, the frequency of higher Heat Index values decreases. This indicates that while extreme heat conditions occur, they are less frequent compared to more moderate levels. This pattern is typical where there are occasional spikes of high heat, but most instances remain within the moderate zone.",
    "title": "Heat Index peaks at 60-100, with rare high extremes.",
    "thread_id": "thread_TtSzF5F4ZdF8xK1xMQ0pHP7m",
    "parent_node_id": null,
    "images": [
      {
        "id": "238f6a48-2c3c-4f90-bf37-531db4780b23",
        "url": "http://localhost:8001/images/238f6a48-2c3c-4f90-bf37-531db4780b23"
      }
    ],
    "questions": [
      {
        "id": "ede9af51-c988-4e3c-b6bf-04e4b6fa2192",
        "content": "What factors cause the Heat Index to exceed 100?"
      },
      {
        "id": "acb7584a-8a8e-4143-bbf1-d5fda1c510ad",
        "content": "How does the Heat Index affect daily activities?"
      },
      {
        "id": "7d31d0f3-4105-4e66-8a4b-9cd98914a6b8",
        "content": "Can high Heat Index impacts be predicted regionally?"
      }
    ]
  },
  {
    "id": "6cf47657-a9b1-449f-846b-94628b3bd424",
    "prompt": "Calculate the correlation between Temperature and Precipitation to explore their relationship.Be precise with your results. Any plots should be made with matplotlib and seaborn and should have clearly defined axes and should not be convoluted by using heat maps and alpha values for appropriate graph types. Plots should use histograms for continuous values, and bar graphs for discrete plots. Aggregation of values should also be used for very volatile data values over time.Calculate the correlation between Temperature and Precipitation to explore their relationship.",
    "text": "The correlation between Temperature and Precipitation is approximately 0.0037, indicating essentially no linear relationship between these two variables. The scatter plot above visually reinforces this, as there is no discernible trend or pattern.",
    "title": "Temperature-Precipitation correlation is negligible.",
    "thread_id": "thread_d2QfIwadesec0nx3MXock7mh",
    "parent_node_id": null,
    "images": [
      {
        "id": "2052f50d-4d1e-44e4-897a-2a6d9d047dce",
        "url": "http://localhost:8001/images/2052f50d-4d1e-44e4-897a-2a6d9d047dce"
      }
    ],
    "questions": [
      {
        "id": "f7fbdca7-0177-4755-8687-40f11cbb67d5",
        "content": "What does negligible correlation imply for planning?"
      },
      {
        "id": "b6a06f58-5f9a-4b39-8154-5932b4ddbda8",
        "content": "Can Temperature affect Precipitation in other ways?"
      },
      {
        "id": "0f71a27a-8377-4ed5-a6ca-6653bf5afea0",
        "content": "Are there stronger relationships with other variables?"
      }
    ]
  },
  {
    "id": "1550f53b-7256-4306-afd9-17fb56fef536",
    "prompt": "Generate a time series plot for Humidity levels over time to identify seasonal trends.Be precise with your results. Any plots should be made with matplotlib and seaborn and should have clearly defined axes and should not be convoluted by using heat maps and alpha values for appropriate graph types. Plots should use histograms for continuous values, and bar graphs for discrete plots. Aggregation of values should also be used for very volatile data values over time.Generate a time series plot for Humidity levels over time to identify seasonal trends.",
    "text": "The time series plot above shows the Humidity levels over time. You can observe fluctuations and a general trend of fluctuation around the mid-60% range. There are no distinct seasonal patterns visible at this scale, but the variation suggests normal day-to-day changes in humidity. If a more granular view of seasonal trends is needed, smoothing techniques or longer-term aggregations could be applied.",
    "title": "Humidity fluctuates around mid-60% without seasonality.",
    "thread_id": "thread_L5pCoST6xxGXMUjK0mm2Yrrv",
    "parent_node_id": null,
    "images": [
      {
        "id": "5712be83-9009-4999-9b85-73423e15a5e7",
        "url": "http://localhost:8001/images/5712be83-9009-4999-9b85-73423e15a5e7"
      }
    ],
    "questions": [
      {
        "id": "d61b4fe5-73ac-45af-8ebf-e2ed29838ec2",
        "content": "What causes the fluctuations in humidity levels?"
      },
      {
        "id": "bb7d3461-dc61-44ba-a20f-f67db6438137",
        "content": "Are there any external factors influencing humidity?"
      },
      {
        "id": "7248d74e-ef99-40e9-be49-a2007bcbd11e",
        "content": "How does humidity impact weather conditions?"
      }
    ]
  }
]

function createL0Node(data: {
  id: string;
  title: string;
  data: { title: string; rows: string[] }[];
}): Node {
  return {
    id: data.id,
    type: 'L0',
    position: { x: 0, y: 0 },
    connectable: false,
    data: { title: data.title, data: data.data }
  };
}

function generateL1NodesAndEdges(parentNode: Node, data: {
  id: string;
  text: string;
  title: string;
  prompt: string;
  thread_id: string;
  parent_node_id: string | null;
  images: {
    id: string;
    url: string;
  }[];
  questions: {
    id: string;
    content: string;
  }[];
}[]): { nodes: Node[], edges: Edge[] } {
  const radius = 800;
  const parentCoordinates = parentNode.position;

  const edges: Edge[] = [];
  const nodes: Node[] = [];
  for (const [index, item] of data.entries()) {
    const angle = ((index + 1) / data.length) * 2 * Math.PI;
    let edgePoints: boolean[] = [];
    let y_buffer = 0;
    let positions: Position[] = [Position.Top, Position.Bottom];
    if (angle < Math.PI / 4 || angle > 7 * Math.PI / 4) {
      edgePoints = [true, true, true, false];
      positions = [Position.Bottom, Position.Top];
    } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
      edgePoints = [false, true, true, true];
      positions = [Position.Right, Position.Left];
    } else if (angle >= 3 * Math.PI / 4 && angle < 5 * Math.PI / 4) {
      edgePoints = [true, false, true, true];
      y_buffer = 200;
      positions = [Position.Top, Position.Bottom];
    } else {
      edgePoints = [true, true, false, true];
      positions = [Position.Left, Position.Right];
    }

    const node: Node = {
      id: item.id,
      type: 'L1',
      connectable: false,
      position: {
        x: (parentCoordinates.x - 125) + Math.sin(angle) * radius,
        y: (parentCoordinates.y - 150 + y_buffer) + Math.cos(angle) * radius
      },
      data: {
        title: item.title,
        text: item.text,
        expanded: false,
        edgePoints: edgePoints,
        questions: item.questions.map((question) => question.content),
        images: item.images.map((image) => image.url),
        id: item.id
      }
    };

    nodes.push(node);

    edges.push({
      id: `${parentNode.id}-to-${item.id}`,
      source: parentNode.id,
      target: item.id,
      type: 'default',
      markerEnd: {
        type: MarkerType.Arrow,
        width: 20,
        height: 20
      },
      style: {
        strokeWidth: 3,
      },
      sourceHandle: positions[0],
      targetHandle: positions[1],
    });

  }

  return { nodes, edges };
}

const flowKey = 'flow';

function FlowCanvas() {
  const [l0NodeId, setL0NodeId] = useState<string | null>(null); // State to track the L0Node ID

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null); // Track upload status

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const populatedNodeIds = useRef<Set<string>>(new Set()); // Keep track of populated nodes
  const usedItemIds = useRef<Set<string>>(new Set()); // Track used item ids

  const [tableData, setTableData] = useState<any>();
  const [file, setFile] = useState<File | null>(null); // State to store the uploaded file

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]) as [
    Node[],
    React.Dispatch<React.SetStateAction<Node[]>>,
    (changes: NodeChange[]) => void
  ];
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]) as [
    Edge[],
    React.Dispatch<React.SetStateAction<Edge[]>>,
    (changes: EdgeChange[]) => void
  ];
  const [rfInstance, setRfInstance] = useState<any>(null);
  const {setCenter, getNode, setViewport} = useReactFlow();

  const intervalRef = useRef<NodeJS.Timer | null>(null); // Store the interval reference

  // Function to update the loading text in unpopulated nodes
  const updateLoadingText = () => {
    setNodes((currentNodes) => {
      const shadowNodes = [...currentNodes];
      return shadowNodes.map((node) => {
        if (node.data.title == "Loading...") {
          const currentStep = parseInt(node.data.text[5], 10); // Extract step number from the string
          if (currentStep < loadingText.length) {
            return {
              ...node,
              data: {
                ...node.data,
                text: loadingText[currentStep] // Move to the next step in loadingText
              }
            };
          }
        }
        return node;
      });
    });
  };

  // Function to start the interval
  const startInterval = () => {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(updateLoadingText, 10000); // Start interval every 10 seconds
    }
  };

  const getNodeViaIDFromAPI = (data_id: string) => {
    let node: Node | undefined;
    setNodes((nds) => {
      const shadow_nds = [...nds];
      node = nds.find(node => node.data.id === data_id);
      return shadow_nds;
    });
    return node;
  };

  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const addAdditionalNode = (parent_node_id: string, level: string, question: { id: string; content: string } | undefined, prompt: string | undefined) => {
    console.log(parent_node_id)
    const parentNode = getNodeViaIDFromAPI(parent_node_id);
    console.log(parentNode)

    if (!parentNode) {
      console.error(`Parent node with ID ${parent_node_id} not found`);
      return;
    }

    const parentCoordinates = parentNode.position;
    const parentData = parentNode.data;
    const numOfNodes = level == "L1" ? 1 : 3;
    const newNodes = [];

    for (let i = 0; i < numOfNodes; i++) {
      // Define the new node's position relative to the parent node based on free space logic
    let newNodePosition = { x: parentCoordinates.x + getRandomInteger(-25, 25), y: parentCoordinates.y - getRandomInteger(100, 800) }; // Default to the top of the parent node
    let edgepoints: Boolean[] = []
    let positions: Position[] = []
    // Left, bottom, right, up (edgePoints order: left, bottom, right, top)
    if (parentData.edgePoints[0] === false) {
      // Left side is free, place the new node to the right of the parent node
      newNodePosition = { x: parentCoordinates.x + getRandomInteger(100, 800) , y: parentCoordinates.y + getRandomInteger(-25, 25)};
      edgepoints = [false, true, true, true]; // Mark the left edge as used
      positions = [Position.Right, Position.Left]; // Connect from right to left
    } else if (parentData.edgePoints[1] === false) {
      // Bottom side is free, place the new node below the parent node
      newNodePosition = { x: parentCoordinates.x + getRandomInteger(-25, 25), y: parentCoordinates.y - getRandomInteger(100, 800)  }; // Place below
      edgepoints = [true, false, true, true]; // Mark the bottom edge as used
      positions = [Position.Top, Position.Bottom]; // Connect from bottom to top
    } else if (parentData.edgePoints[2] === false) {
      // Right side is free, place the new node to the left of the parent node
      newNodePosition = { x: parentCoordinates.x - getRandomInteger(100, 800) , y: parentCoordinates.y + getRandomInteger(-25, 25)};
      edgepoints = [true, true, false, true]; // Mark the right edge as used
      positions = [Position.Left, Position.Right]; // Connect from left to right
    } else if (parentData.edgePoints[3] === false) {
      // Top side is free, place the new node above the parent node
      newNodePosition = { x: parentCoordinates.x + getRandomInteger(-25, 25), y: parentCoordinates.y + getRandomInteger(100, 800)  }; // Place above
      edgepoints = [true, true, true, false]; // Mark the top edge as used
      positions = [Position.Bottom, Position.Top]; // Connect from top to bottom
    }


    // Create a new node for the fetched question node
    const newNode: Node = {
      id: String(Math.random()),
      type: level, // Assuming L2 for question nodes
      position: newNodePosition,
      connectable: false,
      data: {
        title: "Loading...",
        text: loadingText[0],
        expanded: false,
        questions: [],
        edgePoints: edgepoints,
        images: [],
        id: "",
        addAdditionalNode: addAdditionalNode
      }
    };
    console.log(newNode.data.text);

    // Create an edge between the parent node and the new node
    const newEdge: Edge = {
      id: `${parentNode.id}-to-${newNode.id}`,
      source: parentNode.id,
      target: newNode.id,
      type: "default",
      markerEnd: {
        type: MarkerType.Arrow,
        width: 20,
        height: 20
      },
      style: {
        strokeWidth: 3
      },
      sourceHandle: positions[0],
      targetHandle: positions[1],
    };

    // Update the nodes and edges state
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    newNodes.push(newNode);
    }

    if (level == "L1") {
      if (question) {
        handleQuestionClick(question, newNodes[0]?.id ?? '');
      } else {
        console.log("HERE")
        handlePromptClick(prompt ?? '', newNodes[0]?.id ?? '', parent_node_id);
      }
    } else {
      handleExaClick(parentNode.data.id, newNodes.map((node) => node.id))
    }
  };

  const handleQuestionClick = async (
    question: { id: string; content: string },
    node_id: string): Promise<void> => {
    try {
      // Fetch the question node using its ID
      const qNode = await fetchQuestionNode("http://localhost:8001/question", question.id);
      setNodes((nds) => {
        const shadow_nds = [...nds];
        shadow_nds.forEach((node) => {
          if (node.id == node_id) {
            node.data = {
              ...node.data,
              title: qNode?.title ?? '',
              text: qNode?.text ?? '',
              expanded: false,
              questions: qNode?.questions ?? [],
              images: qNode?.images ?? [],
              id: qNode?.id ?? '',
            }
          }
        })

        return shadow_nds
      });

    } catch (error) {
      console.error("Error in handleQuestionClick:", error);
    }
  };

  const handlePromptClick = async (
    prompt: string,
    node_id: string,
    api_node_id: string
  ): Promise<void> => {
  try {
    // Fetch the question node using its ID
    const qNode = await fetchQuestionNodePrompted("http://localhost:8001/question/from", api_node_id, prompt);
    setNodes((nds) => {
      const shadow_nds = [...nds];
      shadow_nds.forEach((node) => {
        if (node.id == node_id) {
          node.data =  {
            ...node.data,
            title: qNode?.title ?? '',
            text: qNode?.text ?? '',
            expanded: false,
            questions: qNode?.questions ?? [],
            images: qNode?.images ?? [],
            id: qNode?.id ?? '',
          }
        }
      })

      return shadow_nds
    });

  } catch (error) {
    console.error("Error in handleQuestionClick:", error);
  }
};

 const handleExaClick = async (
  parent_node_id: string,
  node_ids: string[],
): Promise<void> => {
  try {
    // Fetch the list of ApiItems (qNodeList) using parent_node_id
    const qNodeList = await fetchExaNodes("http://localhost:8001/l2nodes", parent_node_id);

    // Ensure node_ids length matches qNodeList length before proceeding
    if (node_ids.length !== (qNodeList?.length ?? 0)) {
      console.error("node_ids and qNodeList lengths do not match.");
      return;
    }

    // Update the nodes state
    setNodes((nds) => {
      // Create a copy of the current nodes
      const shadow_nds = [...nds];

      // Iterate through node_ids and qNodeList to update each node
      node_ids.forEach((node_id, index) => {
        const correspondingApiItem = qNodeList?.[index];

        // Find the node in shadow_nds with the matching node_id
        shadow_nds.forEach((node) => {
          if (node.id === node_id) {
            // Update the node's data with the corresponding ApiItem
            node.data = {
              ...node.data,
              title: correspondingApiItem?.title ?? '',
              text: correspondingApiItem?.text ?? '',
              expanded: false,
              questions: correspondingApiItem?.questions ?? [],
              images: correspondingApiItem?.images ?? [],
              id: correspondingApiItem?.id ?? '', // Optional: update the id if needed
            };
          }
        });
      });

      // Return the updated nodes array
      return shadow_nds;
    });
  } catch (error) {
    console.error("Error in handleExaClick:", error);
  }
};

  // Poll API to fetch nodes and update progressively
  const pollHubNodes = useCallback(async (hubId: string) => {
    const url = `http://localhost:8001/hubs/${hubId}/nodes`;

    // Callback to handle partial data updates
    const handlePartialResult = (items: ApiResponseItem[]) => {
      // Iterate over the new items, but only update one node per item
      items.forEach((item) => {
        console.log(item);

        if (!usedItemIds.current.has(item.id)) {
          console.log("not used");

          setNodes((nds) => {
            // Find all unpopulated nodes (nodes that still have 'Loading...')
            const unpopulatedIndices = nds
              .map((node, index) =>
                node.data.title === 'Loading...' && !populatedNodeIds.current.has(node.id) ? index : -1
              )
              .filter((index) => index !== -1); // Get valid indices

            console.log("Unpopulated nodes indices:", unpopulatedIndices);

            if (unpopulatedIndices.length > 0 && items.length > 0) {

              // We will only update the number of nodes equal to the number of items
              const updatedNodes = [...nds]; // Create a shallow copy of nodes
              const nonUsedItems = items.filter((item) => !usedItemIds.current.has(item.id));
              unpopulatedIndices.slice(0, nonUsedItems.length).forEach((unpopulatedIndex, i) => {
                const currentItem = nonUsedItems[i];

                if (currentItem) {
                  console.log(currentItem.images.map((image) => image.url))
                  // Update that specific node with the current item
                  updatedNodes[unpopulatedIndex] = {
                    ...updatedNodes[unpopulatedIndex],
                    id: updatedNodes[unpopulatedIndex]?.id || `node-${unpopulatedIndex}`,
                    position: updatedNodes[unpopulatedIndex]?.position || { x: 0, y: 0 }, // Ensure position is always defined
                    data: {
                      ...updatedNodes[unpopulatedIndex]?.data,
                      title: currentItem.title,
                      text: currentItem.text,
                      questions: currentItem.questions,
                      images: currentItem.images.map((image) => image.url),
                      id: currentItem.id,
                      addAdditionalNode: addAdditionalNode
                    },
                  };

                  // Mark the node as populated and the item as used
                  populatedNodeIds.current.add(updatedNodes[unpopulatedIndex]?.id ?? '');
                  usedItemIds.current.add(currentItem.id);
                }
              });

              return updatedNodes;
            }

            return nds; // Return original nodes if no unpopulated nodes found
          });
        }
      });

    };


    try {
      await pollApiUntilNItems(url, 5, handlePartialResult); // Pass the callback to handle partial data
    } catch (error) { /* empty */
    }
  }, [setNodes]);

  const transformTableDataForL0Node = (tableData: Record<string, any>[]) => {
    if (!tableData || tableData.length === 0) return [];

    // Get the column names from the first row
    const columns = tableData?.[0] ? Object.keys(tableData[0]) : [];

    // Map over the columns to create the structure expected by createL0Node
    return columns.map((col) => ({
      title: col,
      rows: tableData.map((row) => row[col]) // Extract the values for each column
    }));
  };


  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadSuccess(null);
      setFile(file);
      populatedNodeIds.current.clear(); // Clear previous populated node tracking

      Papa.parse(file, {
        header: true, // Ensure that column headers are included
        complete: (results: ParseResult<any>) => {
          console.log("parsed csv: ", results.data);
          // Extract the first 5-10 rows from the results
          const slicedData = results.data.slice(0, Math.min(results.data.length, 10)); // Slicing first 10 rows
          setTableData(slicedData); // Store in state
        },
      });

      // const l0Node = createL0Node({ id: 'l0-node', title: 'Node 4', data: [{title: 'Column 1', rows: ['Row 1', 'Row 2', 'Row 3']}, {title: 'Column 2', rows: ['Row 4', 'Row 5', 'Row 6']}, {title: 'Column 3', rows: ['Row 7', 'Row 8', 'Row 9']}]});
      // const { nodes: initialNodes, edges: initialEdges } = generateL1NodesAndEdges(l0Node, testData);
      try {
        console.log("table data: ", tableData);
        const sessionResponse: SessionResponse = await createSession('http://localhost:8001/session/start', file);
        const l0Node = createL0Node({
          id: sessionResponse.hub,
          title: file.name,
          data: tableData,
        });

        testData.map((item) => {
          item.title = "Loading..."
          item.id = String(Math.random())
          item.text = loadingText[0] ?? ''
          item.questions = []
          item.images = []
          item.thread_id = ""
          item.parent_node_id = null
          item.prompt = ""
        });

        const {nodes: initialNodes, edges: initialEdges} = generateL1NodesAndEdges(l0Node, testData);
        await pollHubNodes(sessionResponse.hub); // Start polling for the hub's nodes
        setNodes([l0Node, ...initialNodes]);
        setEdges([...initialEdges]);
        setL0NodeId(l0Node.id);

        // Start updating nodes every 10 seconds
        startInterval();


        setUploadSuccess(true);
      } catch (error) {
        setUploadSuccess(false);
      } finally {
        setIsUploading(false);
      }
    }
  }, [pollHubNodes, setNodes, setTableData]);

  // Listen for changes in tableData and trigger node creation when new tableData is available
  useEffect(() => {
    if (tableData?.length > 0 && l0NodeId) {  // Check if tableData has any rows and if the L0 node already exists

      const transformedData = transformTableDataForL0Node(tableData); // Transform the data

      console.log("Transformed table data: ", transformedData);

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === l0NodeId) {
            console.log("Current node.data before update:", node.data);

            return {
              ...node,
              data: {
                ...node.data,
                data: transformedData, // Update only the tableData for the existing L0 node
              },
            };
          }
          return node;
        })
      );
    }
  }, [tableData, setNodes, l0NodeId]);  // Ensure this runs only when tableData updates and l0NodeId exists

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'default',
            markerEnd: {
              type: MarkerType.Arrow,
              width: 20,
              height: 20
            },
            style: {
              strokeWidth: 3,
            },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {...n, data: {...n.data, isHighlighted: true}};
        }
        return {...n, data: {...n.data, isHighlighted: false}};
      }),
    );

    if ((event.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }

    // Get the position of the clicked node
    const nodeObj = getNode(node.id);
    if (nodeObj) {
      // Center the view on the clicked node
      setCenter(nodeObj.position.x, nodeObj.position.y, {zoom: 0.95, duration: 1500});
    }
  }, [getNode, setCenter, setNodes]);

  const onSave = useCallback(() => {
    if (rfInstance && typeof rfInstance.toObject === 'function') {
      const flow = rfInstance.toObject();
      if (typeof flowKey === 'string') {
        localStorage.setItem(flowKey, JSON.stringify(flow));
      }
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = () => {
      if (typeof flowKey === 'string') {
        const storedFlow = localStorage.getItem(flowKey);
        if (storedFlow) {
          const flow = JSON.parse(storedFlow) as {
            nodes?: Node[];
            edges?: Edge[];
            viewport?: { x: number; y: number; zoom: number };
          };

          if (flow) {
            const {x = 0, y = 0, zoom = 1} = flow.viewport ?? {};
            if (flow.nodes) setNodes(flow.nodes);
            if (flow.edges) setEdges(flow.edges);
            if (typeof setViewport === 'function') {
              setViewport({x, y, zoom});
            }
          }
        }
      }
    };

    void restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  return (
    <div style={{width: '100%', height: '93vh', position: 'relative'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{padding: 2}}
      >
        <Panel position="top-right" className="flex gap-2">
          <Button onClick={onSave}>Save</Button>
          <Button onClick={onRestore}>Restore</Button>
        </Panel>
        <Controls/>
        <Background color="#000000" variant={BackgroundVariant.Cross} gap={12} size={1}/>
      </ReactFlow>

      {nodes.length === 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(128, 128, 128, 0.5)', // Blur effect
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
          <h1 style={{fontSize: '24px', color: '#fff', marginBottom: '20px'}}>Upload a CSV to start</h1>

          <input
            type="file"
            ref={fileInputRef}  // Assign ref to the input
            accept=".csv"
            /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
            onChange={handleFileUpload}
            disabled={isUploading}
            style={{display: 'none'}} // Hide the file input
          />

          {isUploading ? (
            <p style={{color: '#fff'}}>Uploading...</p>
          ) : uploadSuccess === true ? (
            <p style={{color: '#00FF00'}}>Upload successful!</p>
          ) : uploadSuccess === false ? (
            <p style={{color: '#FF0000'}}>Upload failed. Try again.</p>
          ) : (
            <Button onClick={triggerFileInput}>Upload CSV</Button>  // Use button to trigger file input
          )}
        </div>
      )}
    </div>
  );
}


export default function FlowCanvasParent() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
