import MainRouter from "./MainRouter"
import { BrowserRouter } from "react-router-dom"

function App () {

  return (
    <div>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </div>
  )
}

export default App
