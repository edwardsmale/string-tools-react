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
    const commandTypes = this.props.commandTypesService.GetAllCommands()
      .sort(function (a, b) { return a.Name.localeCompare(b.Name); });

    return <div className="help-popup-content">
        {commandTypes.map(cmd => <div key={`${"help_popup_content_command_" + cmd.Name}`} className="help-popup-content__command">
            <div className="help-popup-content__command-name">{cmd.Name}</div>
            <div className="help-popup-content__command-desc">{cmd.Help.Desc}</div>
            <div className="help-popup-content__command-paras-heading">Paras</div>
            <table className="help-popup-content__command-paras-list" cellPadding="0" cellSpacing="0">
              <tbody>
              {cmd.Help.Para.map(para => <tr key={`${"help_popup_content_command_" + cmd.Name + "_para_" + para.name}`} className="help-popup-content__command-paras-list-item">
                    <td className="help-popup-content__command-para-name">{para.name}</td>
                    <td>&rarr;</td>
                    <td className="help-popup-content__command-para-desc">{para.desc}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>)}
    </div>;   
  }
}

export default HelpPopupContent;
