import React from 'react';
import classNames from 'classnames';

const Editable = ({editing, value, onEdit}) => {
  if(editing) {
    return <Editable.Edit value={value} onEdit={onEdit} />;
  }
  return <Editable.Value value={value} />;
}

Editable.Value = ({value, ...props}) => <span {...props}>{value}</span>

export default ({editing, value, onEdit,className, ...props}) => {
  if( editing ) {
    return <Edit className={className}
            value={value}
            onEdit={onEdit}
            {...props} />;
  }
  return <span className={classNames('value', className)} {...props}>{value}</span>;
}


class Edit extends React.Component {

  render() {
    const {className, value, onEdit, ...props}=this.props;

    return <input
      type="text"
      className={classNames('edit', className)}
      autoFocus={true}
      defaultValue={value}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter}
      {...props} />;
    }

    checkEnter=(e) => {
        if(e.key === 'Enter') {
          this.finishEdit(e);
        }
    }

    finishEdit= (e) => {
        const value = e.target.value;
        if(this.props.onEdit) {
          this.props.onEdit(value);
        }
    }
}

Editable.Edit = Edit;
