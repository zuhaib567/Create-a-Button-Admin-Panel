import { useParams } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'
import { Menu, MenuItem, MenuSection, SubMenu } from '@menu/vertical-menu'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label={''}>
          <MenuItem href={`/${locale}/dashboard`} icon={<i className='tabler-category-2' />}>
            Dashboard
          </MenuItem>

          <SubMenu label='Products' icon={<i className='tabler-shopping-bag-minus' />}>
            {/* <MenuItem href={`/${locale}/dashboard/products/add`}>Product Add</MenuItem> */}
            <MenuItem href={`/${locale}/dashboard/products/list`}>Product List</MenuItem>
            <MenuItem href={`/${locale}/dashboard/products/category`}>Product Category</MenuItem>
          </SubMenu>

          {/* <MenuItem href={`/${locale}/dashboard/category`} icon={<i className='tabler-shopping-cart' />}>
            Category
          </MenuItem> */}

          <SubMenu label='Template' icon={<i className='tabler-template' />}>
            <MenuItem href={`/${locale}/dashboard/template/template-list`}>Template List</MenuItem>
            <MenuItem href={`/${locale}/dashboard/template/template-category`}>Template Category</MenuItem>
          </SubMenu>

          <MenuItem href={`/${locale}/dashboard/orders`} icon={<i className='tabler-clipboard-data' />}>
            Orders
          </MenuItem>

          <MenuItem href={`/${locale}/dashboard/images`} icon={<i className='tabler-photo' />}>
            Images
          </MenuItem>

          <MenuItem href={`/${locale}/dashboard/shapes`} icon={<i className='tabler-sort-descending-shapes' />}>
            Shapes
          </MenuItem>

          {/* <MenuItem href={`/${locale}/dashboard/account-settings`} icon={<i className='tabler-user-circle' />}>
            Profile
          </MenuItem> */}
        </MenuSection>
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
