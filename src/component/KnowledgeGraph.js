import React, { useEffect, useRef, useState } from 'react'
import { DataSet } from 'vis-data'
import { Network } from 'vis-network'
import { Modal, Typography } from 'antd'

const { Paragraph, Text } = Typography

function KnowledgeGraph ({ graphData }) {
  const networkContainer = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    if (!graphData) return

    const nodes = new DataSet()
    const edges = new DataSet()

    graphData.nodes.forEach(node => {
      nodes.add({
        id: node.id,
        label: node.label,
        shape: 'box',
        color: { background: '#35a2f4', border: '#0088cc' },
        font: { color: '#fff' },
        title: node.card,
        ...node // 将节点的其他信息（如type, card等）存储在DataSet中
      })
    })

    graphData.nodes.forEach(node => {
      node.connections.forEach((neighborId) => {
        edges.add({
          from: node.id,
          to: neighborId,
        })
      })
    })

    const data = {
      nodes,
      edges
    }

    const options = {
      nodes: {
        shape: 'circle',
        color: {
          background: '#35a2f4',
          border: '#0088cc'
        },
        font: { color: '#fff' }
      },
      edges: {
        color: '#848484',
        arrows: {
          to: { enabled: true, scaleFactor: 1.2 }
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100
      }
    }

    const network = new Network(networkContainer.current, data, options)

    // 处理点击事件
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0]
        const nodeData = nodes.get(nodeId)
        setSelectedNode(nodeData)
      } else {
        setSelectedNode(null)
      }
    })

    // 处理悬停事件（显示工具提示）
    network.on('hoverNode', (params) => {
      const nodeId = params.node
      const nodeData = nodes.get(nodeId)
      if (nodeData) {
        network.canvas.body.container.style.cursor = 'pointer'
        network.setOptions({
          nodes: {
            shadow: true,
            color: {
              background: '#ff5722',
              border: '#e64a19'
            },
            font: {
              color: '#fff',
              size: 16
            }
          }
        })
      }
    })

    network.on('blurNode', () => {
      network.canvas.body.container.style.cursor = 'default'
      network.setOptions({
        nodes: {
          shadow: false,
          color: {
            background: '#35a2f4',
            border: '#0088cc'
          },
          font: {
            color: '#fff',
            size: 14
          }
        }
      })
    })

    return () => {
      network.destroy()
    }
  }, [graphData])

  return (
    <div>
      <div ref={networkContainer} style={{ height: '500px', border: '1px solid #d9d9d9', marginTop: '15px' }} />

      {/* 模态框用于显示节点的详细信息 */}
      {selectedNode && (
        <Modal
          visible={!!selectedNode}
          title="Node Details"
          onCancel={() => setSelectedNode(null)}
          footer={null}
        >
          <Paragraph>
            <Text strong>Label:</Text> {selectedNode.label}
          </Paragraph>
          <Paragraph>
            <Text strong>Type:</Text> {selectedNode.type}
          </Paragraph>
          <Paragraph>
            <Text strong>Card:</Text> {selectedNode.card}
          </Paragraph>
          <Paragraph>
            <Text strong>Detail ID:</Text> {selectedNode.detailId}
          </Paragraph>
        </Modal>
      )}
    </div>
  )
}

export default KnowledgeGraph
