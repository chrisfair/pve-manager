Ext.define('PVE.panel.GuestStatusView', {
    extend: 'PVE.panel.StatusView',
    alias: 'widget.pveGuestStatusView',
    mixins: ['Proxmox.Mixin.CBind'],

    height: 300,

    cbindData: function (initialConfig) {
	var me = this;
	return {
	    isQemu: me.pveSelNode.data.type === 'qemu',
	    isLxc: me.pveSelNode.data.type === 'lxc'
	};
    },

    layout: {
	type: 'vbox',
	align: 'stretch'
    },

    defaults: {
	xtype: 'pveInfoWidget',
	padding: '2 25'
    },
    items: [
	{
	    xtype: 'box',
	    height: 20
	},
	{
	    itemId: 'status',
	    title: gettext('Status'),
	    iconCls: 'fa fa-info fa-fw',
	    printBar: false,
	    textField: 'status'
	},
	{
	    itemId: 'hamanaged',
	    iconCls: 'fa fa-heartbeat fa-fw',
	    title: gettext('HA State'),
	    printBar: false,
	    textField: 'ha',
	    renderer: PVE.Utils.format_ha
	},
	{
	    xtype: 'pveInfoWidget',
	    itemId: 'node',
	    iconCls: 'fa fa-building fa-fw',
	    title: gettext('Node'),
	    cbind: {
		text: '{pveSelNode.data.node}'
	    },
	    printBar: false
	},
	{
	    xtype: 'box',
	    height: 15
	},
	{
	    itemId: 'cpu',
	    iconCls: 'fa fa-fw pve-itype-icon-processor pve-icon',
	    title: gettext('CPU usage'),
	    valueField: 'cpu',
	    maxField: 'cpus',
	    renderer: PVE.Utils.render_cpu_usage,
	    // in this specific api call
	    // we already have the correct value for the usage
	    calculate: Ext.identityFn
	},
	{
	    itemId: 'memory',
	    iconCls: 'fa fa-fw pve-itype-icon-memory pve-icon',
	    title: gettext('Memory usage'),
	    valueField: 'mem',
	    maxField: 'maxmem'
	},
	{
	    itemId: 'swap',
	    xtype: 'pveInfoWidget',
	    iconCls: 'fa fa-refresh fa-fw',
	    title: gettext('SWAP usage'),
	    valueField: 'swap',
	    maxField: 'maxswap',
	    cbind: {
		hidden: '{isQemu}',
		disabled: '{isQemu}'
	    }
	},
	{
	    itemId: 'rootfs',
	    iconCls: 'fa fa-hdd-o fa-fw',
	    title: gettext('Bootdisk size'),
	    valueField: 'disk',
	    maxField: 'maxdisk',
	    printBar: false,
	    renderer: function(used, max) {
		var me = this;
		me.setPrintBar(used > 0);
		if (used === 0) {
		    return PVE.Utils.render_size(max);
		} else {
		    return PVE.Utils.render_size_usage(used,max);
		}
	    }
	},
	{
	    xtype: 'box',
	    height: 15
	},
	{
	    itemId: 'ips',
	    xtype: 'pveAgentIPView',
	    cbind: {
		rstore: '{rstore}',
		pveSelNode: '{pveSelNode}',
		hidden: '{isLxc}',
		disabled: '{isLxc}'
	    }
	}
    ],

    updateTitle: function() {
	var me = this;
	var uptime = me.getRecordValue('uptime');

	var text = "";
	if (Number(uptime) > 0) {
	    text = " (" + gettext('Uptime') + ': ' + Proxmox.Utils.format_duration_long(uptime)
		+ ')';
	}

	me.setTitle(me.getRecordValue('name') + text);
    }
});
