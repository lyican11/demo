import { Card, Input, Button, Typography } from 'antd'

const { Paragraph, Text } = Typography

function QuestionCard ({ question, index, promptValues, setPromptValues }) {
  const handlePromptChange = (e) => {
    const newPromptValues = { ...promptValues, [index]: e.target.value }
    setPromptValues(newPromptValues)
  }
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
          <Input
            value={promptValues[index] || ''}
            onChange={handlePromptChange}
            placeholder="Enter your prompt here..."
            style={{ marginBottom: '10px' }}
          />
          <Button
            type="default"
            style={{ marginRight: '10px' }}
            onClick={() => {
              const newPromptValues = { ...promptValues, [index]: "sample prompt" }
              setPromptValues(newPromptValues)
            }}
          >
            快捷输入
          </Button>
          <Button type="primary">
            发送
          </Button>
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

export default QuestionCard