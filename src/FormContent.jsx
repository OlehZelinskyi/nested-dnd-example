import React, {useCallback} from 'react';
import Table from "./Table";
import Tier from "./Tier";
import update from "immutability-helper";
import {useFormikContext} from "formik";
import {ItemTypes} from "./ItemTypes";

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

const getLevelRank = (level = "") => {
  return "Level " + (Number(level.split(" ")[1]) + 1).toString()
}

const FormContent = () => {

  const {values: {tiers}, setFieldValue} = useFormikContext()

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
      setFieldValue('tiers',
        update(tiers, sortTiersHandler)
      )
    } else {
      setFieldValue('tiers',
        update(tiers, updateSpec)
      )
    }

  }, [tiers])

  const onChange = (e, hierarchicalPath) => {
    let changeTier = tiers;
    let specPath = hierarchicalPath.join('.tiers.') + `.${e.currentTarget.name}`;

    hierarchicalPath.forEach((level, index) => {
      if (
        Array.isArray(changeTier[level].tiers)
        && changeTier[level].tiers.length
        && index !== hierarchicalPath.length - 1
      ) {
        changeTier = changeTier[level].tiers
      } else {
        changeTier = changeTier[level]
      }
    })

    const updateFieldHandler = {
      $set: e.currentTarget.value
    }

    const updateSpec = createObjByPath({}, specPath, updateFieldHandler);


    setFieldValue('tiers',
      update(tiers, updateSpec)
    )

  }

  const addSubTier = (hierarchicalPath) => {
    let currentTier = tiers;
    let specPath = hierarchicalPath.join('.tiers.') + '.tiers';

    hierarchicalPath.forEach((level, index) => {
      if (
        Array.isArray(currentTier[level].tiers)
        && currentTier[level].tiers.length
        && index !== hierarchicalPath.length - 1
      ) {
        currentTier = currentTier[level].tiers
      } else {
        currentTier = currentTier[level]
      }
    })

    const pushTierHandler = {
      $push: [{
        id: Math.random(),
        color: '#bb2017',
        title: '🤩🤩Custom',
        type: getLevelRank(currentTier.type),
        name: '',
        lastname: '',
        tiers: []
      }]
    }

    const updateSpec = createObjByPath({}, specPath, pushTierHandler);

    setFieldValue('tiers',
      update(tiers, updateSpec)
    )

  }

  const deleteTier = (hierarchicalPath) => {
    let changeTier = tiers;
    let specPath = hierarchicalPath.slice(0, hierarchicalPath.length - 1).join('.tiers.') + '.tiers';

    hierarchicalPath.forEach((level, index) => {
      if (
        Array.isArray(changeTier[level].tiers)
        && changeTier[level].tiers.length
        && index !== hierarchicalPath.length - 1
      ) {
        changeTier = changeTier[level].tiers
      } else {
        changeTier = changeTier[level]
      }
    })

    const removeTierHandler = {
      $splice: [[hierarchicalPath[hierarchicalPath.length - 1], 1]]
    }

    const updateSpec = createObjByPath({}, specPath, removeTierHandler);

    if (hierarchicalPath.length === 1) {
      setFieldValue('tiers',
        update(tiers, removeTierHandler)
      )
    } else {
      setFieldValue('tiers',
        update(tiers, updateSpec)
      )
    }
  }

  const renderTiers = ({tier, index, hPath = []}) => {
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
          <button type="button" onClick={() => addSubTier(hierarchicalPath)}>Add subtier</button>
          <button type="button" onClick={() => deleteTier(hierarchicalPath)}>Delete tier</button>
          {tier.tiers.map((t, i) => renderTiers({
            tier: t,
            index: i,
            hPath: hierarchicalPath,
          }))}
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
        <button type="button" onClick={() => addSubTier(hierarchicalPath)}>Add subtier</button>
        <button type="button" onClick={() => deleteTier(hierarchicalPath)}>Delete tier</button>
      </Tier>
    )
  }

  return <Table>
    {tiers.map((tier, index) => renderTiers({tier, index}))}
  </Table>
}

export default FormContent
