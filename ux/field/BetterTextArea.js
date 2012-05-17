/**
 * Improve the UI of the default TextArea in two ways:
 * - Provide a popup editor to give full-screen editing
 * - Enable the scrolling of the text area
 */
Ext.define('Ext.ux.field.BetterTextArea', {

	extend: 'Ext.field.TextArea',
	xtype: 'bettertextareafield',

	config: {
		clearIcon: false,

		editorPanel: {
			xtype: 'panel',
			modal: true,
			centered: true,
			scrollable: false,
			items: [
				{ xtype: 'textareafield', style: 'background: #eeeeee;', clearIcon: false },
				{
					xtype: 'toolbar', docked: 'bottom', layout: { type: 'hbox', pack: 'center' },
					items: [
						{ xtype: 'button', text: 'Ok', padding: '0 1em' },
						{ xtype: 'button', text: 'Cancel', padding: '0 1em' }
					]
				}
			]
		}
	},


	initialize: function() {
		this.callParent();
		this.element.on('tap', this.onFormFieldTap, this);
	},


	applyEditorPanel: function(cfg) {

		if(!this.editorPanel) {
			this.editorPanel = Ext.factory(cfg, Ext.Panel);

			this.editorPanel.on('painted', this.onEditorPanelPainted, this);
			this.editorPanel.element.on('drag', this.onTouchMove, this);
		}

		return this.editorPanel;
	},


	onAccept: function() {
		this.setValue(this.editorPanel.down('textareafield').getValue());
		this.editorPanel.hide();
	},


	onCancel: function() {
		this.editorPanel.hide();
	},


	onEditorPanelPainted: function() {
		var panel = this.editorPanel;

		panel.query('button')[0].on('tap', this.onAccept, this, { single: true });
		panel.query('button')[1].on('tap', this.onCancel, this, { single: true });
		panel.down('textareafield').setHeight(panel.element.down('.x-panel-inner').getHeight());
		panel.down('textareafield').setWidth(panel.element.down('.x-panel-inner').getWidth());

		if(!this.getReadOnly()) {
			panel.down('textareafield').focus();
		}
	},


	onTouchMove: function(e) {
		this.editorPanel.down('textareafield').element.down('textarea').dom.scrollTop -= (e.deltaY / 2.0);
	},


	onFormFieldTap: function() {
		var editor = this.getEditorPanel();

		if(!this.isInitialized) {
			this.isInitialized = true;
			editor.setWidth(Ext.getBody().getWidth() - 20 );
			editor.setHeight(Ext.getBody().getHeight() - 20);
			Ext.Viewport.add(editor);
		}

		editor.down('textareafield').setValue(this.getValue());
		editor.down('textareafield').setReadOnly(this.getReadOnly());

		editor.show();
	}
});