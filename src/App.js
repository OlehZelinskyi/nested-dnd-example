import './App.css';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import Table from "./Table";
import Tier from "./Tier";
import React, {useCallback, useEffect, useState} from "react";
import update from 'immutability-helper'
import objectPath from 'object-path'
import {ItemTypes} from "./ItemTypes";
import {Formik, Form, Field} from 'formik'

window.update = update
window.objectPath = objectPath

const createObjByPath = (obj, path, value = null) => {
  path = typeof path === 'string' ? path.split('.') : path;
  let current = obj;
  while (path.length > 1) {
    const [head, ...tail] = path;
    path = tail;
    if (current[head] === undefined) {
      current[head] = {};
    }
    current = current[head];
  }
  current[path[0]] = value;
  return obj;
};

const INITIAL_STATE = {
  'monarchy_2': {
    name: 'Ezio',
    lastname: 'Auditore',
    desc: [
      {name: 'Altair', lastname: 'Preceptor'},
      {name: 'Malik', lastname: 'Right Hand'},
      {name: 'Leonardo', lastname: 'da Vinci'},
      {name: 'Mateo', lastname: 'Polo'},
    ]
  }
}

function App() {
  const [tiers, setTiers] = useState([
    // {
    //   id: 0,
    //   title: '🤩King',
    //   color: '#146b00',
    //   type: ItemTypes.TOP,
    //   tiers: [
    //     {
    //       id: 1,
    //       title: '🤩Prince',
    //       color: '#1da400',
    //       type: ItemTypes.MIDDLE,
    //       tiers: [
    //         {
    //           id: 2,
    //           color: '#66fd51',
    //           title: '🤩Young princess',
    //           type: ItemTypes.BOTTOM,
    //         },
    //         {
    //           id: 8,
    //           color: '#66fd51',
    //           title: '🤩Young prince',
    //           type: ItemTypes.BOTTOM,
    //         }
    //       ]
    //     },
    //     {
    //       id: 3,
    //       color: '#1da400',
    //       title: '🤩Princess',
    //       type: ItemTypes.MIDDLE,
    //     },
    //     {
    //       id: 4,
    //       color: '#1da400',
    //       title: '🤩Bastard',
    //       type: ItemTypes.MIDDLE,
    //     },
    //   ]
    // },
    {
      id: 5,
      title: '🤩🤩King',
      color: '#00366b',
      type: ItemTypes.TOP,
      name: 'Ezio',
      lastname: 'Auditore',
      tiers: [
        {
          id: 6,
          color: '#3d83d2',
          title: '🤩🤩Princess',
          type: ItemTypes.MIDDLE,
          name: 'Altair',
          lastname: 'Preceptor'
        },
        {
          id: 7,
          color: '#3d83d2',
          title: '🤩🤩Prince',
          type: ItemTypes.MIDDLE,
          name: 'Malik',
          lastname: 'Right Hand'
        },
        {
          id: 9,
          color: '#3d83d2',
          title: '🤩🤩Prince II',
          type: ItemTypes.MIDDLE,
          name: 'Leonardo',
          lastname: 'da Vinci'
        },
        {
          id: 10,
          color: '#3d83d2',
          title: '🤩🤩Prince III',
          type: ItemTypes.MIDDLE,
          name: 'Mateo',
          lastname: 'Polo'
        }
      ]
    },
  ])


  const moveTiers = useCallback((dragIndex, hoverIndex, hierarchicalPath = []) => {
    let dragTier = tiers;
    let specPath = hierarchicalPath.slice(0, hierarchicalPath.length - 1).join('.tiers.') + '.tiers';

    hierarchicalPath.forEach((level, index) => {
      if (
        Array.isArray(dragTier[level].tiers)
        && dragTier[level].tiers.length
        && index !== hierarchicalPath.length - 1
      ) {
        dragTier = dragTier[level].tiers
      } else {
        dragTier = dragTier[level]
      }
    })


    const sortTiersHandler = {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragTier]]
    }

    const updateSpec = createObjByPath({}, specPath, sortTiersHandler);

    if (hierarchicalPath.length === 1) {
      setTiers(
        update(tiers, sortTiersHandler)
      )
    } else {
      setTiers(
        update(tiers, updateSpec)
      )
    }

  }, [tiers])

  const onChange = (e, hierarchicalPath) => {
    let dragTier = tiers;
    let specPath = hierarchicalPath.join('.tiers.') + `.${e.currentTarget.name}`;

    hierarchicalPath.forEach((level, index) => {
      if (
        Array.isArray(dragTier[level].tiers)
        && dragTier[level].tiers.length
        && index !== hierarchicalPath.length - 1
      ) {
        dragTier = dragTier[level].tiers
      } else {
        dragTier = dragTier[level]
      }
    })

    const updateFieldHandler = {
      $set: e.currentTarget.value
    }

    const updateSpec = createObjByPath({}, specPath, updateFieldHandler);


    debugger;

    setTiers(
      update(tiers, updateSpec)
    )

    // if (hierarchicalPath.length === 1) {
    //   setTiers(
    //     update(tiers, sortTiersHandler)
    //   )
    // } else {
    //   setTiers(
    //     update(tiers, updateSpec)
    //   )
    // }
  }

  const renderTiers = (tier, index, hPath = [], namePath = '') => {
    // hierarchical path (parents index only)
    const hierarchicalPath = [...hPath, index];

    if (Array.isArray(tier.tiers) && tier.tiers.length) {
      return (
        <Tier
          id={tier.id}
          index={index}
          hierarchicalPath={hierarchicalPath}
          moveTiers={moveTiers}
          color={tier.color}
          key={tier.id}
          type={tier.type}
        >
          {tier.title}
          <input
            name="name"
            value={tier.name} type="text" onChange={(e) => onChange(e, hierarchicalPath)}/>
          <input
            name="lastname"
            value={tier.lastname} type="text" onChange={(e) => onChange(e, hierarchicalPath)}/>
          {tier.tiers.map((t, i) => renderTiers(t, i, hierarchicalPath))}
        </Tier>
      )
    }

    return (
      <Tier
        key={tier.id}
        id={tier.id}
        index={index}
        hierarchicalPath={hierarchicalPath}
        moveTiers={moveTiers}
        color={tier.color}
        type={tier.type}
      >
        {tier.title}
        <input
          name="name"
          value={tier.name} type="text" onChange={(e) => onChange(e, hierarchicalPath)}/>
        <input
          name="lastname"
          value={tier.lastname} type="text" onChange={(e) => onChange(e, hierarchicalPath)}/>
      </Tier>
    )
  }

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Formik initialValues={INITIAL_STATE} onSubmit={(values => console.log(values))}>
          <Form>
            <Table>
              {tiers.map((tier, index) => renderTiers(tier, index))}
            </Table>
          </Form>
        </Formik>
      </DndProvider>
    </div>
  );
}

export default App;
