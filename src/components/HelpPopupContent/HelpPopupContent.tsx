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

    return <div className="help-popup-content">
        {commandTypes.map(cmd => <div key={`${"help_popup_content_command_" + cmd.name}`} className="help-popup-content__command">
            <div className="help-popup-content__command-name">{cmd.name}</div>
            <div className="help-popup-content__command-desc">{cmd.desc}</div>
            <div className="help-popup-content__command-paras-heading">Paras</div>
            <table className="help-popup-content__command-paras-list" cellPadding="0" cellSpacing="0">
              <tbody>
              {cmd.para.map(para => <tr key={`${"help_popup_content_command_" + cmd.name + "_para_" + para.name}`} className="help-popup-content__command-paras-list-item">
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
