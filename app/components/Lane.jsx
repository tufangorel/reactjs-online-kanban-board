import React from 'react';
//import uuid from 'uuid';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import Notes from './Notes';
import LaneActions from '../actions/LaneActions'
import LaneHeader from './LaneHeader';

import {compose} from 'redux';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

// export default ({lane, ...props}) => (
//   <div {...props}>{lane.name}</div>
// )

const Lane = ({ connectDropTarget, lane, notes, LaneActions, NoteActions, ...props}) => {

  const editNote = (id,task) => {
    NoteActions.update({id, task, editing:false});
  };

/*
  const addNote = e => {
    e.stopPropagation();
    const noteId = uuid.v4();

    NoteActions.create( {
        id: noteId,
        task: 'New task'
    });

    LaneActions.attachToLane({
      laneId: lane.id,
      noteId
    });

  };
  */

  const deleteNote = (noteId,e) => {
    e.stopPropagation();

    LaneActions.detachFromLane({
      laneId: lane.id,
      noteId
    });

    NoteActions.delete(noteId);
  };

  const activateNoteEdit = id=> {
    NoteActions.update({id, editing:true});
  };

  return connectDropTarget(
    <div {...props}>
      <LaneHeader lane={lane} />
      <Notes
        notes={selectNotesByIds(notes, lane.notes)}
        onNoteClick={activateNoteEdit}
        onEdit={editNote}
        onDelete={deleteNote}
      />
    </div>
  );
};

function selectNotesByIds( allNotes, noteIds=[] ) {
  return noteIds.reduce( ( notes, id )  => notes.concat( allNotes.filter( note => note.id === id ) ), [] );
}

const noteTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;
        if( !targetProps.lane.notes.length ) {
          LaneActions.attachToLane({
            laneId: targetProps.lane.id,
            noteId: sourceId
          });
        }
    }
};

//export default compose(({notes}) => ({notes}), {NoteActions, LaneActions} )(Lane)

export default compose(DropTarget(ItemTypes.NOTE, noteTarget, connect => ({
  connectDropTarget: connect.dropTarget()
})),
  connect(({notes}) => ({notes}),
  {
    NoteActions,
    LaneActions
  })
)(Lane)
