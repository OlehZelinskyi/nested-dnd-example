import './App.css';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import React from "react";
import {ItemTypes} from "./ItemTypes";
import {Formik, Form} from 'formik'
import FormContent from "./FormContent";


const INITIAL_STATE = {
  tiers: [
    {
      id: 0,
      title: '🤩🤩King',
      color: '#00366b',
      type: 'Level 1',
      name: 'Rober',
      lastname: 'de Sable',
      tiers: []
    },
    {
      id: 5,
      title: '🤩🤩King',
      color: '#00366b',
      type: 'Level 1',
      name: 'Ezio',
      lastname: 'Auditore',
      tiers: [
        {
          id: 6,
          color: '#3d83d2',
          title: '🤩🤩Princess',
          type: 'Level 2',
          name: 'Altair',
          lastname: 'Preceptor',
          tiers: []
        },
        {
          id: 7,
          color: '#3d83d2',
          title: '🤩🤩Prince',
          type: 'Level 2',
          name: 'Malik',
          lastname: 'Right Hand',
          tiers: []
        },
        {
          id: 9,
          color: '#3d83d2',
          title: '🤩🤩Prince II',
          type: 'Level 2',
          name: 'Leonardo',
          lastname: 'da Vinci',
          tiers: []
        },
        {
          id: 10,
          color: '#3d83d2',
          title: '🤩🤩Prince III',
          type: 'Level 2',
          name: 'Mateo',
          lastname: 'Polo',
          tiers: []
        }
      ]
    }]
}

function App() {

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Formik initialValues={INITIAL_STATE} onSubmit={(values => console.log(values))}>
          <Form>
            <FormContent/>
            <button type={"submit"}>Log Values</button>
          </Form>
        </Formik>
      </DndProvider>
    </div>
  );
}

export default App;
