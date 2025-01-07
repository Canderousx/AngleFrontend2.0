import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {ChannelComponent} from "./channel/channel.component";
import {UploadComponent} from "./upload/upload.component";
import {UploadMetadataComponent} from "./upload-metadata/upload-metadata.component";
import {NotFoundComponent} from "../shared/components/not-found/not-found.component";
import {SettingsComponent} from "./settings/settings.component";
import {VideoPlayerComponent} from "./video-player/video-player.component";
import {WatchComponent} from "./watch/watch.component";
import {VideoManagerComponent} from "./video-manager/video-manager.component";
import {SearchComponent} from "./search/search.component";
import {ReportComponent} from "../shared/components/report/report.component";
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {UnresolvedComponent} from "./admin-panel/unresolved/unresolved.component";
import {OwnCasesComponent} from "./admin-panel/own-cases/own-cases.component";
import {A} from "@angular/cdk/keycodes";
import {ArchiveComponent} from "./admin-panel/archive/archive.component";
import {SummaryComponent} from "./admin-panel/summary/summary.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {RestorePasswordComponent} from "./forgot-password/restore-password/restore-password.component";
import {EmailConfirmationComponent} from "./email-confirmation/email-confirmation.component";

export const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: "full"},
  {path: 'signup',component: SignUpComponent},
  {path: 'signin', component: SignInComponent},
  {path: 'channel', component: ChannelComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'upload/metadata',component: UploadMetadataComponent},
  {path:"settings",component: SettingsComponent},
  {path: "watch",component: WatchComponent},
  {path: "manager",component: VideoManagerComponent},
  {path: "search",component: SearchComponent},
  {path: "report",component:ReportComponent},
  {path: "forgotPassword",component: ForgotPasswordComponent},
  {path: "restorePassword", component: RestorePasswordComponent},
  {path: "confirmAccount",component: EmailConfirmationComponent},
  {path: "admin",component: AdminPanelComponent,
  children: [
    {path: 'unresolved',component: UnresolvedComponent},
    {path: 'resolved',component: OwnCasesComponent},
    {path: 'archive',component: ArchiveComponent},
    {path: 'summary',component: SummaryComponent},
  ]},
  {path: '**', component: NotFoundComponent}
];
