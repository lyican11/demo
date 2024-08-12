import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Upload, Button, Pagination, message, Card, Typography, Tabs } from 'antd'
import { UploadOutlined, LeftOutlined, RightOutlined, VideoCameraOutlined, FilePdfOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import 'antd/dist/reset.css'
import KnowledgeGraph from '../component/KnowledgeGraph'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cat.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`

const { Text, Paragraph } = Typography
const { TabPane } = Tabs

function HomePage () {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [file, setFile] = useState(null)
  const [questions, setQuestions] = useState([])
  const [graphData, setGraphData] = useState(null)
  const [selectedLeftTab, setSelectedLeftTab] = useState('pdf')
  const [selectedRightTab, setSelectedRightTab] = useState('questions')

  function onDocumentLoadSuccess ({ numPages }) {
    setNumPages(numPages)
  }

  const onFileChange = (info) => {
    const selectedFile = info.file.originFileObj
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setPageNumber(1)
        message.success('PDF file uploaded successfully.')
      } else if (selectedFile.type.startsWith('video/')) {
        setFile(URL.createObjectURL(selectedFile))
        message.success('Video file uploaded successfully.')
      } else {
        message.error('Please upload a valid file.')
      }
    }
  }

  const goToPage = (page) => {
    setPageNumber(page)
  }

  const generateQuestions = () => {
    const data = {
      document_id: "f2405076-35b5-4ef2-bca2-c5627a5c8d10",
      status: 200,
      type: "exercise",
      message: "success",
      payload: [
        {
          type: "single-choice",
          question: "丁奎岭是谁？",
          options: ["一个演员", "一个演员", "一个演员", "一个演员"],
          answer: "a"
        },
        {
          type: "multiple-choice",
          question: "丁奎岭是谁？",
          options: ["一个演员", "一个演员", "一个演员", "一个演员"],
          answer: "abcd"
        },
        {
          type: "fill-blank",
          question: ["丁奎岭是", "。"],
          answer: ["一个演员"]
        },
        {
          type: "long-answer",
          question: "丁奎岭是谁？",
          answer: "一个演员"
        }
      ]
    }

    setTimeout(() => {
      setQuestions(data.payload)
    }, 1000)
  }

  const generateGraph = () => {
    const data = {
      document_id: "f2405076-35b5-4ef2-bca2-c5627a5c8d10",
      status: 200,
      type: "graph",
      message: "success",
      payload: {
        nodes: [
          {
            id: "0",
            label: "丁奎岭",
            type: "person",
            connections: ["1", "2"],
            card: "message from dingkui",
            detailId: "80313741-3307-4123-ba9c-07897fd7e5fc"
          },
          {
            id: "1",
            label: "Node 1",
            type: "person",
            connections: ["0"],
            card: "Detail about Node 1",
            detailId: "node-1-detail-id"
          },
          {
            id: "2",
            label: "Node 2",
            type: "person",
            connections: ["0"],
            card: "Detail about Node 2",
            detailId: "node-2-detail-id"
          }
        ]
      }
    }
    setGraphData(data.payload)
  }

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'single-choice':
        return (
          <Card title={`Question ${index + 1} (Single Choice)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              <Text strong>{question.question}</Text>
            </Paragraph>
            {question.options.map((option, idx) => (
              <Paragraph key={idx}>
                <Text>{String.fromCharCode(65 + idx)}. {option}</Text>
              </Paragraph>
            ))}
            <Paragraph>
              <Text type="secondary">Answer: {question.answer.toUpperCase()}</Text>
            </Paragraph>
          </Card>
        )
      case 'multiple-choice':
        return (
          <Card title={`Question ${index + 1} (Multiple Choice)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              <Text strong>{question.question}</Text>
            </Paragraph>
            {question.options.map((option, idx) => (
              <Paragraph key={idx}>
                <Text>{String.fromCharCode(65 + idx)}. {option}</Text>
              </Paragraph>
            ))}
            <Paragraph>
              <Text type="secondary">Answer: {question.answer.toUpperCase()}</Text>
            </Paragraph>
          </Card>
        )
      case 'fill-blank':
        return (
          <Card title={`Question ${index + 1} (Fill in the Blank)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              {question.question.map((part, idx) => (
                <Text key={idx}>
                  {part}
                  {idx < question.answer.length && (
                    <Text underline>{'______'}</Text>
                  )}
                </Text>
              ))}
            </Paragraph>
            <Paragraph>
              <Text type="secondary">Answer: {question.answer.join(', ')}</Text>
            </Paragraph>
          </Card>
        )
      case 'long-answer':
        return (
          <Card title={`Question ${index + 1} (Long Answer)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              <Text strong>{question.question}</Text>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">Answer: {question.answer}</Text>
            </Paragraph>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ padding: '20px', display: 'flex' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <Tabs defaultActiveKey="pdf" onChange={setSelectedLeftTab} style={{ marginBottom: '20px' }}>
          <TabPane tab={<span><FilePdfOutlined /> PDF</span>} key="pdf" />
          <TabPane tab={<span><VideoCameraOutlined /> Video</span>} key="video" />
        </Tabs>
        {selectedLeftTab === 'pdf' && (
          <>
            <Upload
              accept="application/pdf"
              showUploadList={false}
              onChange={onFileChange}
              style={{ marginBottom: '20px' }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload PDF</Button>
            </Upload>
            {file && file.type === 'application/pdf' && (
              <>
                <div style={{ width: '100%', height: '100vh', overflow: 'auto', border: '1px solid #d9d9d9', padding: '10px', marginTop: "20px" }}>
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} scale={1.2} />
                  </Document>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    icon={<LeftOutlined />}
                    onClick={() => goToPage(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </Button>
                  <Pagination
                    simple
                    current={pageNumber}
                    total={numPages}
                    pageSize={1}
                    onChange={goToPage}
                  />
                  <Button
                    icon={<RightOutlined />}
                    onClick={() => goToPage(pageNumber + 1)}
                    disabled={pageNumber >= numPages}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </>
        )}
        {selectedLeftTab === 'video' && (
          <>
            <Upload
              accept="video/*"
              showUploadList={false}
              onChange={onFileChange}
              style={{ marginBottom: '20px' }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload Video</Button>
            </Upload>
            {file && file.type.startsWith('video/') && (
              <div style={{ marginTop: '20px' }}>
                <video controls style={{ width: '100%', height: 'auto' }}>
                  <source src={file} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <Tabs defaultActiveKey="questions" onChange={setSelectedRightTab} style={{ marginBottom: '20px' }}>
          <TabPane tab={<span><AppstoreAddOutlined /> Questions</span>} key="questions" />
          <TabPane tab={<span><AppstoreAddOutlined /> Knowledge Graph</span>} key="graph" />
        </Tabs>
        {selectedRightTab === 'questions' && (
          <>
            <Button onClick={generateQuestions} style={{ marginBottom: '20px' }}>
              Generate Questions
            </Button>
            <div>
              {questions.length > 0 ? (
                questions.map((question, index) => renderQuestion(question, index))
              ) : (
                <Paragraph>No questions generated yet.</Paragraph>
              )}
            </div>
          </>
        )}
        {selectedRightTab === 'graph' && (
          <>
            <Button onClick={generateGraph} style={{ marginBottom: '5px' }}>
              Generate Knowledge Graph
            </Button>
            <div>
              {graphData ? <KnowledgeGraph graphData={graphData} /> : <Paragraph>No graph data available.</Paragraph>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage
