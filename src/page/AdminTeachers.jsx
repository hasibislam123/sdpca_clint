import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Panel from '../component/Admin/Panel'
import LocalisedField from '../component/Admin/LocalisedField'
import ImagePicker from '../component/Admin/ImagePicker'
import ConfirmDelete from '../component/Admin/ConfirmDelete'
import Select from '../component/ui/Select'
import Input from '../component/ui/Input'
import Button from '../component/ui/Button'
import EmptyState from '../component/ui/EmptyState'
import ContentImage from '../component/Content/ContentImage'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'
import { mediaUrl } from '../config/api'
import { pickLanguageText } from '../util/localised'
import { emptyTeacher, teacherDraft } from '../admin/drafts'

// The groups come from the server's schema; these are the only two the public page has sections for.
const GROUP_LABEL = { faculty: 'admin.groupFaculty', staff: 'admin.groupStaff' }

export default function AdminTeachers() {
  const { t, lang, tNumber } = useLanguage()
  const { schema, teachers, saveTeacher, deleteTeacher, busy } = useAdminContent()
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState(null)

  const languages = schema.languages ?? ['en', 'bn']
  const groups = schema.teacherGroups?.length ? schema.teacherGroups : ['faculty', 'staff']

  const group = groups.includes(params.get('group')) ? params.get('group') : groups[0]

  const groupOptions = groups.map((name) => ({ value: name, label: t(GROUP_LABEL[name] ?? name) }))

  const list = teachers
    .filter((teacher) => teacher.group === group)
    .sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id))

  const selectGroup = (next) => {
    setForm(null)
    setParams({ group: next })
  }

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const setNumberField = (key, raw) => {
    const next = Number.parseInt(raw, 10)
    setField(key, Number.isFinite(next) ? next : 0)
  }

  const handleSave = async () => {
    const saved = await saveTeacher(form)
    if (saved) setForm(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <Panel title={t('admin.teachersTitle')} description={t('admin.teachersDescription')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="teacher-group"
            label={t('admin.section')}
            value={group}
            options={groupOptions}
            onChange={(event) => selectGroup(event.target.value)}
          />
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm text-base-content/60">
              {t('admin.teacherCount', { n: tNumber(String(list.length)) })}
              {list.some((teacher) => !teacher.active) ? ` · ${t('admin.hidden')}` : ''}
            </p>
            <Button
              type="button"
              size="sm"
              className="gap-2"
              onClick={() => setForm(emptyTeacher(group, languages))}
              disabled={Boolean(form)}
            >
              <Icon name="plus" className="h-4 w-4" />
              {t('admin.addTeacher')}
            </Button>
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState icon="users" title={t('admin.emptyTeachers')} description={t('admin.emptyTeachersBody')} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {list.map((teacher) => (
              <li
                key={teacher.id}
                className="flex flex-wrap items-start gap-4 rounded-box border border-base-300 bg-base-200/50 p-3"
              >
                <div className="w-20 shrink-0">
                  <ContentImage
                    src={teacher.mediaId ? mediaUrl(teacher.mediaId) : ''}
                    label={t('admin.noImage')}
                    ratio="aspect-[3/4]"
                    fit="contain"
                  />
                </div>
                <div className="flex min-w-40 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-base-content">
                    {pickLanguageText(teacher.name, lang) || t('admin.untitled')}
                    {!teacher.active && <span className="ms-2 badge badge-ghost badge-sm">{t('admin.hidden')}</span>}
                  </span>
                  <span className="text-xs text-base-content/60">
                    {pickLanguageText(teacher.designation, lang) || t('admin.noDesignation')}
                  </span>
                  <span className="text-xs text-base-content/45">
                    {pickLanguageText(teacher.subjects, lang)}
                    {teacher.experienceYears > 0 ? ` · ${tNumber(String(teacher.experienceYears))} ${t('admin.years')}` : ''}
                    {teacher.email ? ` · ${teacher.email}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={busy || Boolean(form)}
                    onClick={() => setForm(teacherDraft(teacher, languages))}
                  >
                    <Icon name="edit" className="h-4 w-4" />
                    {t('admin.edit')}
                  </Button>
                  <ConfirmDelete
                    label={pickLanguageText(teacher.name, lang) || teacher.id}
                    busy={busy}
                    onConfirm={() => deleteTeacher(teacher.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {form && (
        <Panel
          title={form.id ? t('admin.editTeacher') : t('admin.addTeacher')}
          description={t(GROUP_LABEL[form.group] ?? form.group)}
          action={
            <Button type="button" size="sm" variant="ghost" onClick={() => setForm(null)}>
              {t('admin.close')}
            </Button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              id="teacher-group-field"
              label={t('admin.section')}
              value={form.group}
              options={groupOptions}
              onChange={(event) => setField('group', event.target.value)}
            />
            <Input
              id="teacher-sort"
              type="number"
              label={t('admin.order')}
              value={String(form.sort)}
              min={0}
              onChange={(event) => setNumberField('sort', event.target.value)}
            />
          </div>

          <LocalisedField
            name="teacher-name"
            label={t('admin.teacherNameLabel')}
            value={form.name}
            languages={languages}
            maxLength={schema.limits?.title}
            onChange={(value) => setField('name', value)}
          />
          <LocalisedField
            name="teacher-designation"
            label={t('admin.designationLabel')}
            value={form.designation}
            languages={languages}
            maxLength={schema.limits?.title}
            onChange={(value) => setField('designation', value)}
          />
          <LocalisedField
            name="teacher-subjects"
            label={t('admin.subjectsLabel')}
            value={form.subjects}
            languages={languages}
            hint={t('admin.subjectsHint')}
            maxLength={schema.limits?.textValue}
            onChange={(value) => setField('subjects', value)}
          />
          <LocalisedField
            name="teacher-qualification"
            label={t('teachers.qualLabel')}
            value={form.qualification}
            languages={languages}
            multiline
            rows={3}
            maxLength={schema.limits?.body}
            onChange={(value) => setField('qualification', value)}
          />
          <LocalisedField
            name="teacher-background"
            label={t('teachers.backgroundLabel')}
            value={form.background}
            languages={languages}
            multiline
            rows={3}
            maxLength={schema.limits?.body}
            onChange={(value) => setField('background', value)}
          />
          <LocalisedField
            name="teacher-experience"
            label={t('teachers.experienceLabel')}
            value={form.experience}
            languages={languages}
            multiline
            rows={3}
            maxLength={schema.limits?.body}
            onChange={(value) => setField('experience', value)}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              id="teacher-years"
              type="number"
              label={t('admin.experienceYearsLabel')}
              value={String(form.experienceYears)}
              min={0}
              max={70}
              onChange={(event) => setNumberField('experienceYears', event.target.value)}
            />
            <Input
              id="teacher-email"
              type="email"
              label={t('admin.emailLabel')}
              value={form.email}
              maxLength={schema.limits?.meta}
              onChange={(event) => setField('email', event.target.value)}
            />
            <Input
              id="teacher-phone"
              type="tel"
              label={t('admin.phoneLabel')}
              value={form.phone}
              maxLength={schema.limits?.meta}
              onChange={(event) => setField('phone', event.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-base-content">
            <input
              type="checkbox"
              className="checkbox border-base-300 bg-base-100"
              checked={form.active}
              onChange={(event) => setField('active', event.target.checked)}
            />
            {t('admin.visible')}
          </label>

          <ImagePicker
            id="teacher-photo"
            label={t('admin.photoLabel')}
            value={form.mediaId}
            fit="contain"
            onChange={(id) => setField('mediaId', id)}
          />

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={handleSave} disabled={busy}>
              {busy ? t('admin.saving') : t('admin.save')}
            </Button>
            <Button type="button" variant="light" onClick={() => setForm(null)} disabled={busy}>
              {t('admin.cancel')}
            </Button>
          </div>
        </Panel>
      )}
    </div>
  )
}
