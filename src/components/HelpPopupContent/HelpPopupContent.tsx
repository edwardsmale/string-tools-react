import React from 'react';
import './HelpPopupContent.scss';
import { CommandTypesService } from '../../services/command-types.service';

interface HelpPopupContentProps {
    commandTypesService: CommandTypesService;
}

interface HelpPopupContentState {
}

class HelpPopupContent extends React.Component<HelpPopupContentProps, HelpPopupContentState> {

  render() {
    const commandTypes = this.props.commandTypesService.CommandTypes.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    return <div className="HelpPopupContent">
        {commandTypes.map(cmd => <div key={`${"help_popup_content_command_" + cmd.name}`} className="HelpPopupContent__command">
            <div className="HelpPopupContent__command-name">{cmd.name}</div>
            <div className="HelpPopupContent__command-desc">{cmd.desc}</div>
            <div className="HelpPopupContent__command-paras-heading">Paras</div>
            <table className="HelpPopupContent__command-paras-list" cellPadding="0" cellSpacing="0">
              <tbody>
              {cmd.para.map(para => <tr key={`${"help_popup_content_command_" + cmd.name + "_para_" + para.name}`} className="HelpPopupContent__command-paras-list-item">
                    <td className="HelpPopupContent__command-para-name">{para.name}</td>
                    <td>&rarr;</td>
                    <td className="HelpPopupContent__command-para-desc">{para.desc}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>)}
    </div>;   
  }
}

export default HelpPopupContent;
