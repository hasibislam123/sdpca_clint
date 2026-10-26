import PageHeader from './PageHeader'
import SectionPlaceholder from './SectionPlaceholder'

export default function PageSkeleton({ title, description, breadcrumb, sections = [] }) {
  return (
    <>
      <PageHeader title={title} description={description} breadcrumb={breadcrumb} />
      {sections.map((section) => (
        <SectionPlaceholder key={section.title} {...section} />
      ))}
    </>
  )
}
