import { AdPreview } from '../../components/ad/AdPreview';
import { Avatar, AvatarOverflow } from '../../ui/atoms';
import { PlusIcon } from '../../ui/icons';
import { ROUTES } from '../../router';
import { MiniEditorPreview } from './MiniEditorPreview';
import {
  CARD_PREVIEW_BG,
  CARD_PREVIEW_TINT,
  type CustomComponent,
  type Project,
  type Template,
} from './welcomeData';
import s from './welcome.module.css';

export function TemplateCard({ template }: { template: Template }) {
  return (
    <a href={ROUTES.prototyper} className={s.card}>
      <div className={s.cardPreview} style={{ height: 210 }}>
        <AdPreview kind={template.kind} tint={CARD_PREVIEW_TINT} bg={CARD_PREVIEW_BG} />
      </div>
      <div className={s.cardBody}>
        <div className={s.cardName}>{template.name}</div>
        <div className={s.cardDesc}>{template.desc}</div>
      </div>
    </a>
  );
}

/** `age` names whichever date the list is currently sorted by. */
export function ProjectCard({ project, age }: { project: Project; age: string }) {
  return (
    <a href={ROUTES.prototyper} className={s.card}>
      <div className={s.cardPreview} style={{ height: 190 }}>
        <AdPreview kind={project.kind} tint={CARD_PREVIEW_TINT} bg={CARD_PREVIEW_BG} />
      </div>
      <div className={s.projectBody}>
        <div className={s.projectMeta}>
          <div className={s.projectName}>{project.name}</div>
          <div className={s.projectAge}>{age}</div>
        </div>
        <div className={s.avatarStack}>
          {project.collaborators.map((person) => (
            <Avatar
              key={person.initials}
              initials={person.initials}
              color={person.color}
              size={26}
              stacked
            />
          ))}
          {project.more && <AvatarOverflow label={project.more} />}
        </div>
      </div>
    </a>
  );
}

export function ComponentCard({ component }: { component: CustomComponent }) {
  return (
    <a href={ROUTES.componentEditor} className={s.card}>
      <MiniEditorPreview kind={component.kind} />
      <div className={s.componentBody}>
        <div className={s.componentName}>{component.name}</div>
        <div className={s.componentDesc}>{component.desc}</div>
      </div>
    </a>
  );
}

type BlankCardProps = {
  href: string;
  title: string;
  desc: string;
};

/** Dashed "start from scratch" cell that closes a card grid. */
export function BlankCard({ href, title, desc }: BlankCardProps) {
  return (
    <a href={href} className={s.blankCard}>
      <span className={s.blankIcon}>
        <PlusIcon size={22} />
      </span>
      <span>
        <span className={s.blankTitle}>{title}</span>
        <span className={s.blankDesc}>{desc}</span>
      </span>
    </a>
  );
}
