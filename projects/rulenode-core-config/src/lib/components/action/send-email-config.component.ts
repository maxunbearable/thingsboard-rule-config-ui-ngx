import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-send-email-config',
  templateUrl: './send-email-config.component.html',
  styleUrls: []
})
export class SendEmailConfigComponent extends RuleNodeConfigurationComponent {

  sendEmailConfigForm: FormGroup;

  smtpProtocols: string[] = [
    'smtp',
    'smtps'
  ];

  tlsVersions = ['TLSv1', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3'];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.sendEmailConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.sendEmailConfigForm = this.fb.group({
      useSystemSmtpSettings: [configuration ? configuration.useSystemSmtpSettings : false, []],
      smtpProtocol: [configuration ? configuration.smtpProtocol : null, []],
      smtpHost: [configuration ? configuration.smtpHost : null, []],
      smtpPort: [configuration ? configuration.smtpPort : null, []],
      timeout: [configuration ? configuration.timeout : null, []],
      enableTls: [configuration ? configuration.enableTls : false, []],
      tlsVersion: [configuration ? configuration.tlsVersion : null, []],
      enableProxy: [configuration ? configuration.enableProxy : false, []],
      proxyHost: [configuration ? configuration.proxyHost : null, []],
      proxyPort: [configuration ? configuration.proxyPort : null, []],
      proxyUser: [configuration ? configuration.proxyUser :null, []],
      proxyPassword: [configuration ? configuration.proxyPassword :null, []],
      username: [configuration ? configuration.username : null, []],
      password: [configuration ? configuration.password : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['useSystemSmtpSettings'];
  }

  protected updateValidators(emitEvent: boolean) {
    const useSystemSmtpSettings: boolean = this.sendEmailConfigForm.get('useSystemSmtpSettings').value;
    if (useSystemSmtpSettings) {
      this.sendEmailConfigForm.get('smtpProtocol').setValidators([]);
      this.sendEmailConfigForm.get('smtpHost').setValidators([]);
      this.sendEmailConfigForm.get('smtpPort').setValidators([]);
      this.sendEmailConfigForm.get('timeout').setValidators([]);
      this.sendEmailConfigForm.get('proxyHost').setValidators([]);
      this.sendEmailConfigForm.get('proxyPort').setValidators([]);
    } else {
      this.sendEmailConfigForm.get('smtpProtocol').setValidators([Validators.required]);
      this.sendEmailConfigForm.get('smtpHost').setValidators([Validators.required]);
      this.sendEmailConfigForm.get('smtpPort').setValidators([Validators.required, Validators.min(1), Validators.max(65535)]);
      this.sendEmailConfigForm.get('timeout').setValidators([Validators.required, Validators.min(0)]);
      this.sendEmailConfigForm.get('enableProxy').setValidators([]);
      this.sendEmailConfigForm.get('proxyHost').setValidators([Validators.required]);
      this.sendEmailConfigForm.get('proxyPort').setValidators([Validators.required, Validators.min(1), Validators.max(65535)]);
      this.sendEmailConfigForm.get('proxyUser').setValidators([]);
      this.sendEmailConfigForm.get('proxyPassword').setValidators([]);
    }
    this.sendEmailConfigForm.get('smtpProtocol').updateValueAndValidity({emitEvent});
    this.sendEmailConfigForm.get('smtpHost').updateValueAndValidity({emitEvent});
    this.sendEmailConfigForm.get('smtpPort').updateValueAndValidity({emitEvent});
    this.sendEmailConfigForm.get('timeout').updateValueAndValidity({emitEvent});
  }

  enableProxy(): boolean {
    const enableProxy: boolean = this.sendEmailConfigForm.get('enableProxy').value === true;
    if (enableProxy) {
      this.sendEmailConfigForm.get('proxyHost').enable();
      this.sendEmailConfigForm.get('proxyPort').enable();
    } else {
      this.sendEmailConfigForm.get('proxyHost').disable();
      this.sendEmailConfigForm.get('proxyPort').disable();
    }
    return enableProxy;
  }
}
